import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SprintDto } from './dto/sprint.dto';
import { PrismaService } from 'nestjs-prisma';
import { Role, Sprint } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class SprintsService {
  private readonly logger = new Logger(SprintsService.name);
  constructor(private prisma: PrismaService) {}

  async create(data: SprintDto, userId: number) {
    const exists = await this.prisma.sprint.findFirst({
      where: {
        deletedAt: null,
        projectId: data.projectId,
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });

    if (exists) {
      const message = `Sprint already exists.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
    data.start = dayjs(data.start).startOf('day').toDate();
    data.end = dayjs(data.end).endOf('day').toDate();
    await this.checkPermission(data, userId);
    await this.validateSprint(data);
    return this.prisma.sprint.create({ data });
  }

  findAll() {
    const where = { deletedAt: null };
    return this.prisma.sprint.findMany({
      where,
      include: {
        UserStories: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.sprint.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        UserStories: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async update(id: number, data: SprintDto, userId: number) {
    await this.checkPermission(data, userId);
    const oldSprint = await this.findOne(id);

    if (data.name != null) {
      const exists = await this.prisma.sprint.findFirst({
        where: {
          deletedAt: null,
          NOT: { id },
          projectId: oldSprint.projectId,
          name: {
            equals: data.name.toString(),
            mode: 'insensitive',
          },
        },
      });

      if (exists) {
        const message = `Sprint already exists.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
    }
    data.start = dayjs(data.start).startOf('day').toDate();
    data.end = dayjs(data.end).endOf('day').toDate();

    if (
      oldSprint.start.getTime() != data.start.getTime() ||
      oldSprint.end.getTime() != data.end.getTime()
    ) {
      await this.validateSprint(data);
    }

    return this.prisma.sprint.update({ data: { ...data }, where: { id } });
  }

  async markDeleted(id: number, userId: number) {
    const sprint = await this.prisma.sprint.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });
    await this.checkPermission(sprint, userId);
    sprint.deletedAt = new Date();
    return this.prisma.sprint.update({
      data: sprint,
      where: {
        id,
      },
    });
  }

  async validateSprint(data: SprintDto): Promise<void> {
    this.logger.debug('Validating sprint.');
    if (dayjs(data.start).isAfter(dayjs())) {
      const message = `Sprint doesn't start in the future.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    if (dayjs(data.end).isBefore(dayjs())) {
      const message = `Sprint ends before it starts.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    if (await this.checkConflict(data)) {
      const message = `Sprint overlaps with another sprint.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
    if ([0, 6].includes(dayjs(data.start).day())) {
      const message = `Sprint starts on weekend.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
    if ([0, 6].includes(dayjs(data.end).day())) {
      const message = `Sprint ends on weekend.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
  }

  async checkConflict(data: SprintDto): Promise<Sprint> {
    this.logger.debug('checking sprint conflict.');
    return this.prisma.sprint.findFirst({
      where: {
        projectId: data.projectId,
        OR: [
          { end: { gte: data.start }, start: { lte: data.end } },
          { end: { gte: data.start }, start: { lte: data.end } },
        ],
      },
    });
  }

  async checkPermission(data: SprintDto, userId: number): Promise<void> {
    this.logger.debug('Checking user permissions.');
    const project = await this.prisma.project.findFirst({
      where: { id: data.projectId },
    });
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    if (userId !== project.scrumMasterId && user.role !== Role.ADMIN) {
      const message = `User isn't the scrum master.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
  }
}
