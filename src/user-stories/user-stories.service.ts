import {
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

@Injectable()
export class UserStoriesService {
  private readonly logger = new Logger(UserStoriesService.name);
  constructor(private prisma: PrismaService) {}

  async create(data: UserStoryDto, userId: number) {
    const exists = await this.prisma.userStory.findFirst({
      where: {
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

    if (userId != project.projectOwnerId && userId != project.scrumMasterId) {
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
    for (const tempStory of data) {
      returnStories.push({
        ...tempStory,
        ...(await this.canBeAccepted(tempStory.id)),
      });
    }
    return returnStories;
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

    if (userId != project.projectOwnerId && userId != project.scrumMasterId) {
      const message = `Missing access right.`;
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

    if (userId != project.projectOwnerId) {
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

    if (userId != project.projectOwnerId && userId != project.scrumMasterId) {
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

  async addStories(data: StoryListDto) {
    const sprint = await this.prisma.sprint.findFirstOrThrow({
      where: {
        id: data.sprintId,
        deletedAt: null,
      },
    });
    await this.prisma.userStory.updateMany({
      where: {
        id: { in: data.stories },
        deletedAt: null,
        acceptanceTest: false,
        sprintId: null,
        points: { not: null },
      },
      data: {
        sprintId: sprint.id,
      },
    });
    await this.prisma.userStory.updateMany({
      where: {
        id: { notIn: data.stories },
      },
      data: {
        sprintId: null,
      },
    });

    return this.prisma.userStory.findMany({
      where: { sprintId: data.sprintId },
    });
  }
}
