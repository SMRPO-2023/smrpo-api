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
import {
  Role,
  StoryPriority,
  TaskStatus,
  User,
  UserStory,
} from '@prisma/client';
import * as dayjs from 'dayjs';
import { RejectUserStoryDto } from './dto/reject-user-story.dto';

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
      include: {
        comments: true,
        Task: {
          where: { deletedAt: null },
          include: {
            timeLogs: {
              select: {
                id: true,
                hours: true,
                remainingHours: true,
                createdAt: true,
              },
              where: { deletedAt: null },
            },
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
    });

    const returnStories = [];
    let currentLoad = 0;
    for (const tempStory of data) {
      const numOfStoryTasksDone = tempStory.Task.filter(
        (t) => t.status === TaskStatus.FINISHED
      ).length;
      currentLoad += tempStory.points;
      returnStories.push({
        ...{
          ...tempStory,
          // of all tasks
          hoursTotal: tempStory.Task.reduce(
            (a, b) => a + b?.timeLogs.reduce((c, d) => c + d?.hours, 0),
            0
          ),
          // of not finished tasks and not accepted story
          hoursRemaining: !tempStory.acceptanceTest
            ? tempStory.Task.reduce((prev, task) => {
                const timelog = task?.timeLogs?.sort(
                  (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                )[0];
                if (task.status !== TaskStatus.FINISHED) {
                  return prev + timelog?.remainingHours || +0;
                } else {
                  return prev;
                }
              }, 0)
            : 0,
          initialEstimate: tempStory.Task.reduce((a, b) => a + b?.estimate, 0),
          numUnfinishedTasks: tempStory.Task.length - numOfStoryTasksDone,
          numFinishedTasks: numOfStoryTasksDone,
          numTotalTasks: tempStory.Task.length,
          Task: tempStory.Task,
        },
        ...(await this.canBeAccepted(tempStory)),
      });
    }

    let totalRemainingHours = 0;
    let totalSpentHours = 0;
    for (const story of returnStories) {
      totalRemainingHours += story.hoursRemaining;
      totalSpentHours += story.hoursTotal;
    }
    return { stories: returnStories, currentLoad, totalRemainingHours, totalSpentHours };
  }

  async findRealized(projectId: number, sprintId: number) {
    const where = {
      deletedAt: null,
      acceptanceTest: true,
    };
    if (projectId) {
      where['projectId'] = projectId;
    }
    if (sprintId) {
      where['sprintId'] = sprintId;
    }
    return this.prisma.userStory.findMany({
      where,
      include: {
        comments: true,
      },
    });
  }

  async findNotEstimated(projectId: number, sprintId: number) {
    const where = {
      deletedAt: null,
      points: null,
    };
    if (projectId) {
      where['projectId'] = projectId;
    }
    if (sprintId) {
      where['sprintId'] = sprintId;
    }
    return this.prisma.userStory.findMany({
      where,
      include: {
        comments: true,
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
      include: {
        comments: true,
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
      include: {
        comments: true,
      },
    });
  }

  async findUnrealizedWithSprint(projectId: number, sprintId: number) {
    const where = {
      deletedAt: null,
      NOT: {
        sprintId: null,
      },
      acceptanceTest: false,
    };
    if (projectId) {
      where['projectId'] = projectId;
    }
    if (sprintId) {
      where['sprintId'] = sprintId;
    }
    const data = await this.prisma.userStory.findMany({
      where,
      include: {
        comments: true,
      },
    });

    const returnStories = [];
    for (const tempStory of data) {
      returnStories.push({
        ...tempStory,
        ...(await this.canBeAccepted(tempStory)),
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
      include: {
        comments: {
          include: {
            User: {
              select: {
                firstname: true,
                email: true,
                lastname: true,
                username: true,
              },
            },
          },
        },
        Sprint: {
          select: {
            id: true,
            name: true,
            start: true,
            end: true,
          },
        },
      },
    });
    return { ...data, ...(await this.canBeAccepted(data)) };
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

  async accept(id: number, userId: number) {
    const userStory = await this.findOne(id);

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
      where: {
        userStoryId: id,
        timeLogs: { none: { remainingHours: 0 } },
        deletedAt: null,
      },
    });

    if (tasks.length > 0) {
      const message = 'User story has unfinished tasks.';
      this.logger.warn(message);
      throw new ForbiddenException(message);
    }

    const sprint = await this.prisma.sprint.findFirstOrThrow({
      where: {
        id: userStory.sprintId,
        deletedAt: null,
      },
    });
    const currentDate = dayjs();
    if (currentDate.isBefore(sprint.start) || currentDate.isAfter(sprint.end)) {
      const message = `The sprint is not active.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }

    return this.prisma.userStory.update({
      where: { id },
      data: {
        acceptanceTest: true,
      },
    });
  }

  async canBeAccepted(userStory: UserStory) {
    const returnFalse = { canBeAccepted: false };

    const tasks = await this.prisma.task.findMany({
      where: {
        userStoryId: userStory.id,
        timeLogs: { every: { remainingHours: { gt: 0 } } },
        deletedAt: null,
      },
    });

    if (tasks.length > 0) {
      return returnFalse;
    }
    if (userStory.sprintId) {
      const sprint = await this.prisma.sprint.findFirstOrThrow({
        where: {
          id: userStory.sprintId,
          deletedAt: null,
        },
      });
      const currentDate = dayjs();
      if (
        currentDate.isBefore(sprint.start) ||
        currentDate.isAfter(sprint.end)
      ) {
        return returnFalse;
      }
    } else {
      return returnFalse;
    }

    return { canBeAccepted: true };
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
          OR: [{ points: null }, { priority: StoryPriority.WONT_HAVE }],
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
          { priority: StoryPriority.WONT_HAVE },
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

  async reject(id: number, user: User, data: RejectUserStoryDto) {
    const story = await this.prisma.userStory.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id: story.projectId,
      },
    });
    if (user.id !== project.projectOwnerId && user.role !== Role.ADMIN) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    if (story.acceptanceTest) {
      const message = `User story can not be removed from the sprint.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }

    await this.prisma.storyComment.create({
      data: { message: data.message, userId: user.id, userStoryId: id },
    });

    return this.prisma.userStory.update({
      where: {
        id,
      },
      data: {
        sprintId: null,
      },
    });
  }
}
