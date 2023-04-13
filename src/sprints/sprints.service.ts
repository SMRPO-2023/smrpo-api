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

  async findAll() {
    const where = { deletedAt: null };
    const sprints = await this.prisma.sprint.findMany({
      where,
      include: {
        UserStories: {
          where: {
            deletedAt: null,
          },
        },
      },
      orderBy: { start: 'asc' },
    });
    return sprints.map((s) => {
      // s['finished'] =
      //   s.UserStories.filter((us) => us.acceptanceTest).length ===
      //   s.UserStories.length;
      s['finished'] = dayjs(s.end).isBefore(dayjs());
      return s;
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.sprint.findFirst({
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

    let currentLoad = 0;
    for (const story of data.UserStories) {
      currentLoad += story.points;
    }
    return { sprint: data, currentLoad: currentLoad };
  }

  async update(id: number, data: SprintDto, userId: number) {
    await this.checkPermission(data, userId);
    const oldSprint = (await this.findOne(id)).sprint;

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

    if (data.start !== oldSprint.start || data.end !== oldSprint.end) {
      data.start = dayjs(data.start).startOf('day').toDate();
      data.end = dayjs(data.end).endOf('day').toDate();

      if (
        oldSprint.start.getTime() != data.start.getTime() ||
        oldSprint.end.getTime() != data.end.getTime()
      ) {
        await this.validateSprint(data, id);
      }
    }

    // On active sprint allow only change to points
    if (
      dayjs(data.start).isBefore(dayjs()) &&
      dayjs(data.end).isAfter(dayjs())
    ) {
      return this.prisma.sprint.update({
        data: {
          velocity: data.velocity,
        },
        where: { id },
      });
    }

    data.start = dayjs(data.start).startOf('day').toDate();
    data.end = dayjs(data.end).endOf('day').toDate();

    if (data.velocity !== oldSprint.velocity) {
      await this.checkVelocity(data, id);
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

  async getActiveSprint(projectId: number) {
    const currentDate = dayjs();
    return this.prisma.sprint.findFirst({
      where: {
        projectId,
        deletedAt: null,
        end: { gte: currentDate.toDate() },
        start: { lte: currentDate.toDate() },
      },
      include: {
        UserStories: {
          where: {
            deletedAt: null,
          },
          include: {
            Task: {
              where: {
                deletedAt: null,
              },
              include: {
                assignedTo: {
                  select: {
                    id: true,
                    username: true,
                    firstname: true,
                    lastname: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async validateSprint(data: SprintDto, id?: number): Promise<void> {
    this.logger.debug('Validating sprint.');
    if (dayjs(data.start).add(1, 'day').isBefore(dayjs())) {
      const message = `Sprint doesn't start in the future.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    if (dayjs(data.end).isBefore(data.start)) {
      const message = `Sprint ends before it starts.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    if (await this.checkConflict(data, id)) {
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

  async checkConflict(data: SprintDto, id?: number): Promise<Sprint> {
    this.logger.debug('checking sprint conflict.');
    const where = {
      projectId: data.projectId,
      deletedAt: null,
      end: { gte: data.start },
      start: { lte: data.end },
    };
    if (id) {
      where['NOT'] = { id };
    }
    return this.prisma.sprint.findFirst({
      where,
    });
  }

  async checkVelocity(data: SprintDto, sprintId: number) {
    this.logger.debug('checking sprint velocity.');
    const storiesSum = await this.prisma.userStory.aggregate({
      _sum: { points: true },
      where: {
        deletedAt: null,
        sprintId: sprintId,
      },
    });
    if (storiesSum._sum.points > data.velocity) {
      const message = `Number of story points exceeds sprint velocity.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
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
