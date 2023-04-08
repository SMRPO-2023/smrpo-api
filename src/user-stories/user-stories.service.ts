import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserStoryDto } from './dto/user-story.dto';
import { StoryListDto } from './dto/story-list.dto';
import { AcceptUserStoryDto } from './dto/accept-user-story.dto';
import { Role, StoryPriority, User } from '@prisma/client';
import * as dayjs from 'dayjs';
import { UpdateStoryPointsDto } from './dto/update-story-points.dto';

@Injectable()
export class UserStoriesService {
  private readonly logger = new Logger(UserStoriesService.name);
  constructor(private prisma: PrismaService) {}

  async create(data: UserStoryDto, userId: number) {
    const exists = await this.prisma.userStory.findFirst({
      where: {
        projectId: data.projectId,
        deletedAt: null,
        title: {
          equals: data.title,
          mode: 'insensitive',
        },
      },
    });

    if (exists) {
      const message = `User story already exists.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
    const id = data.projectId;
    const project = await this.prisma.project.findUnique({ where: { id } });

    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    if (
      userId !== project.projectOwnerId &&
      userId !== project.scrumMasterId &&
      user.role !== Role.ADMIN
    ) {
      const message = `User doesn't have access to the project.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    return this.prisma.userStory.create({ data });
  }

  async findAll(projectId?: number, sprintId?: number) {
    const where = { deletedAt: null };
    if (projectId) {
      where['projectId'] = projectId;
    }
    if (sprintId) {
      where['sprintId'] = sprintId;
    }
    const data = await this.prisma.userStory.findMany({
      where,
    });

    const returnStories = [];
    let currentLoad = 0;
    for (const tempStory of data) {
      currentLoad += tempStory.points;
      returnStories.push({
        ...tempStory,
        ...(await this.canBeAccepted(tempStory.id)),
      });
    }
    return { stories: returnStories, pointsSum: currentLoad };
  }

  async findRealized(projectId: number) {
    return this.prisma.userStory.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        acceptanceTest: true,
      },
    });
  }

  async findFutureReleases(projectId: number) {
    const currentDate = dayjs();
    return this.prisma.userStory.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        acceptanceTest: false,
        priority: StoryPriority.WONT_HAVE,
        NOT: {
          Sprint: {
            AND: [
              {
                start: {
                  lte: currentDate.toDate(),
                },
                end: {
                  gte: currentDate.toDate(),
                },
              },
            ],
          },
        },
      },
    });
  }

  async findUnrealizedWithoutSprint(projectId: number) {
    return this.prisma.userStory.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        sprintId: null,
        acceptanceTest: false,
      },
    });
  }

  async findUnrealizedWithSprint(projectId: number) {
    const data = await this.prisma.userStory.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        NOT: {
          sprintId: null,
        },
        acceptanceTest: false,
      },
    });

    const returnStories = [];
    for (const tempStory of data) {
      returnStories.push({
        ...tempStory,
        ...(await this.canBeAccepted(tempStory.id)),
      });
    }
    return returnStories;
  }

  async findOne(id: number) {
    const data = await this.prisma.userStory.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    return { ...data, ...(await this.canBeAccepted((id = id))) };
  }

  async update(id: number, data: UserStoryDto, userId: number) {
    const userStory = await this.findOne(id);

    if (!userStory) {
      const message = 'User story not found.';
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    if (data.title != null) {
      const exists = await this.prisma.userStory.findFirst({
        where: {
          projectId: data.projectId,
          deletedAt: null,
          NOT: { id },
          title: {
            equals: data.title.toString(),
            mode: 'insensitive',
          },
        },
      });

      if (exists) {
        const message = `User story already exists.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
    }

    if (userStory.sprintId != null || userStory.acceptanceTest) {
      const message = `User story can't be changed.`;
      this.logger.warn(message);
      throw new ForbiddenException(message);
    }

    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });

    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    if (
      userId !== project.projectOwnerId &&
      userId !== project.scrumMasterId &&
      user.role !== Role.ADMIN
    ) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.userStory.update({ where: { id }, data });
  }

  async updateStoryPoints(
    id: number,
    data: UpdateStoryPointsDto,
    userId: number
  ) {
    const userStory = await this.findOne(id);

    if (!userStory) {
      const message = 'User story not found.';
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    if (userStory.sprintId != null || userStory.acceptanceTest) {
      const message = `User story can't be changed.`;
      this.logger.warn(message);
      throw new ForbiddenException(message);
    }

    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });

    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    if (userId !== project.scrumMasterId && user.role !== Role.ADMIN) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.userStory.update({ where: { id }, data });
  }

  async accept(id: number, data: AcceptUserStoryDto, userId: number) {
    const userStory = await this.findOne(id);
    const acceptanceTest = data.acceptanceTest;

    if (!userStory) {
      const message = 'User story not found.';
      this.logger.warn(message);
      throw new NotFoundException(message);
    }

    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    if (userId != project.projectOwnerId && user.role !== Role.ADMIN) {
      const message = `User is not the project owner.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    const tasks = await this.prisma.task.findMany({
      where: { userStoryId: id, done: false },
    });

    if (acceptanceTest && tasks.length > 0) {
      const message = 'User story has unfinished tasks.';
      this.logger.warn(message);
      throw new ForbiddenException(message);
    }

    return this.prisma.userStory.update({
      where: { id },
      data: {
        acceptanceTest: acceptanceTest,
      },
    });
  }

  async canBeAccepted(id: number) {
    let canBeAccepted = true;

    const tasks = await this.prisma.task.findMany({
      where: { userStoryId: id, done: false },
    });

    if (tasks.length > 0) {
      canBeAccepted = false;
    }
    return { canBeAccepted };
  }

  async remove(id: number, userId: number) {
    const userStory = await this.findOne(id);

    if (!userStory) {
      const message = 'User story not found.';
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    if (userStory.sprintId != null || userStory.acceptanceTest) {
      const message = `User story can't be deleted.`;
      this.logger.warn(message);
      throw new ForbiddenException(message);
    }

    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    if (
      userId !== project.projectOwnerId &&
      userId !== project.scrumMasterId &&
      user.role !== Role.ADMIN
    ) {
      const message = `User doesn't have access to the project.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    const story = await this.prisma.userStory.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    story.deletedAt = new Date();
    return this.prisma.userStory.update({
      where: { id },
      data: story,
    });
  }

  async getAddable(projectId: number) {
    return this.prisma.userStory.findMany({
      where: {
        projectId,
        deletedAt: null,
        acceptanceTest: false,
        sprintId: null,
        NOT: {
          points: null,
        },
      },
    });
  }

  async addStoriesToSprint(data: StoryListDto, user: User) {
    const sprint = await this.prisma.sprint.findFirstOrThrow({
      where: {
        id: data.sprintId,
        deletedAt: null,
      },
    });
    const currentDate = dayjs();
    if (currentDate.isBefore(sprint.start) || currentDate.isAfter(sprint.end)) {
      const message = `The sprint is not active.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id: sprint.projectId,
      },
    });
    if (user.id !== project.scrumMasterId && user.role !== Role.ADMIN) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    const badStories = await this.prisma.userStory.findMany({
      where: {
        id: { in: data.stories },
        deletedAt: null,
        OR: [
          { acceptanceTest: true },
          { points: null },
          {
            NOT: { AND: [{ projectId: sprint.projectId }, { sprintId: null }] },
          },
        ],
      },
    });
    if (badStories.length != 0) {
      const message = `Some stories can't be added to the sprint.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    const oldStoriesSum = await this.prisma.userStory.aggregate({
      _sum: { points: true },
      where: {
        deletedAt: null,
        sprintId: sprint.id,
      },
    });
    const newStoriesSum = await this.prisma.userStory.aggregate({
      _sum: { points: true },
      where: {
        id: { in: data.stories },
        deletedAt: null,
      },
    });
    if (
      oldStoriesSum._sum.points + newStoriesSum._sum.points >
      sprint.velocity
    ) {
      const message = `Number of story points exceeds sprint velocity.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }

    return this.prisma.userStory.updateMany({
      where: {
        id: { in: data.stories },
        deletedAt: null,
        acceptanceTest: false,
        points: { not: null },
      },
      data: {
        sprintId: sprint.id,
      },
    });
  }

  async removeStoryFromSprint(id: number, user: User) {
    const story = await this.prisma.userStory.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (story.acceptanceTest) {
      const message = `User story can not be removed from the sprint.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id: story.projectId,
      },
    });
    if (user.id !== project.scrumMasterId && user.role !== Role.ADMIN) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.userStory.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        sprintId: null,
      },
    });
  }
}
