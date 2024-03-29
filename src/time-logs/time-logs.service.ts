import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TimeLogDto } from './dto/time-log.dto';
import { Role, TaskStatus, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as dayjs from 'dayjs';

@Injectable()
export class TimeLogsService {
  private readonly logger = new Logger(TimeLogsService.name);
  constructor(private prisma: PrismaService) {}
  async logHours(data: TimeLogDto, user: User) {
    await this.validate(data, user);
    data.day = dayjs(data.day).startOf('day').toDate();
    const existingLog = await this.prisma.timeLog.findFirst({
      where: {
        deletedAt: null,
        day: data.day,
        userId: user.id,
        taskId: data.taskId,
      },
    });
    if (existingLog) {
      const hoursSum = existingLog.hours + data.hours;
      const maxHours = 15;
      if (hoursSum > maxHours) {
        const message = `Sum of hours exceeds ${maxHours} hours.`;
        this.logger.warn(message);
        throw new BadRequestException(message);
      }
      return this.prisma.timeLog.update({
        data: { hours: hoursSum, title: data.title },
        where: { id: existingLog.id },
      });
    }
    return this.prisma.timeLog.create({ data });
  }

  findAll(user: User, taskId?: number, userId?: number) {
    const where = { deletedAt: null, userId: user.id };
    if (taskId) {
      where['taskId'] = taskId;
    }
    if (userId) {
      if (user.id !== userId && user.role !== Role.ADMIN) {
        const message = `User doesn't have access to the logs.`;
        this.logger.warn(message);
        throw new UnauthorizedException(message);
      }
      where['userId'] = userId;
    } else {
      if (user.role !== Role.ADMIN) {
        const message = `Only admin can view all logs.`;
        this.logger.warn(message);
        throw new UnauthorizedException(message);
      }
    }
    return this.prisma.timeLog.findMany({
      where,
    });
  }

  async update(id: number, data: TimeLogDto, user: User) {
    await this.validate(data, user);
    data.day = dayjs(data.day).startOf('day').toDate();
    const existingLog = await this.prisma.timeLog.findFirstOrThrow({
      where: {
        deletedAt: null,
        id,
      },
    });
    if (user.id !== existingLog.userId && user.role !== Role.ADMIN) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    const maxHours = 15;
    if (data.hours > maxHours) {
      const message = `Sum of hours exceeds ${maxHours} hours.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    return this.prisma.timeLog.update({
      data: { ...data },
      where: { id: existingLog.id },
    });
  }

  async remove(id: number, user: User) {
    const timeLog = await this.prisma.timeLog.findFirstOrThrow({
      where: {
        id,
      },
    });
    if (user.id !== timeLog.userId && user.role !== Role.ADMIN) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    const task = await this.prisma.task.findFirstOrThrow({
      where: {
        deletedAt: null,
        id: timeLog.taskId,
      },
    });
    const userStory = await this.prisma.userStory.findFirstOrThrow({
      where: {
        deletedAt: null,
        id: task.userStoryId,
      },
    });
    if (userStory.acceptanceTest) {
      const message = `User story is already marked as accepted.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    return this.prisma.timeLog.delete({ where: { id } });
  }

  async validate(data: TimeLogDto, user: User) {
    if (data.userId !== user.id && user.role !== Role.ADMIN) {
      const message = `User can't log hours for other users.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    const task = await this.prisma.task.findFirstOrThrow({
      where: {
        deletedAt: null,
        id: data.taskId,
      },
    });
    if (
      task.status !== TaskStatus.ACCEPTED &&
      task.status !== TaskStatus.FINISHED
    ) {
      const message = `The task is not accepted.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    if (task.userId !== data.userId) {
      const message = `Task is not assigned to the user.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    const userStory = await this.prisma.userStory.findFirstOrThrow({
      where: {
        deletedAt: null,
        id: task.userStoryId,
      },
    });
    if (userStory.acceptanceTest) {
      const message = `User story is already marked as accepted.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
  }
}
