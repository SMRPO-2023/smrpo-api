import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TimeLogDto } from './dto/time-log.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import dayjs from 'dayjs';

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
        data: { hours: hoursSum },
        where: existingLog,
      });
    }
    return this.prisma.timeLog.create({ data });
  }

  findAll(user: User, taskId?: number, userId?: number) {
    const where = { deletedAt: null, userId: user.id };
    if (taskId) {
      where['taskId'] = taskId;
    }
    if (
      (userId && user.id !== userId && user.role !== 'ADMIN') ||
      user.role !== 'ADMIN'
    ) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    if (userId) {
      where['userId'] = userId;
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
    if (user.id !== existingLog.userId && user.role !== 'ADMIN') {
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
      where: existingLog,
    });
  }

  async remove(id: number, user: User) {
    const timeLog = await this.prisma.timeLog.findFirstOrThrow({
      where: {
        id,
      },
    });
    if (user.id !== timeLog.userId && user.role !== 'ADMIN') {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.timeLog.delete({ where: { id } });
  }

  validate(data: TimeLogDto, user: User) {
    if (data.userId !== user.id) {
      const message = `User can't log hours for other users.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    // TODO(mevljas): Check whether the task is accepted.
    // TODO(mevljas): Check whether the task is assigned to the user.
    // TODO(mevljas): check for finished stories.
  }
}
