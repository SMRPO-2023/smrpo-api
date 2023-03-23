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

@Injectable()
export class UserStoriesService {
  private readonly logger = new Logger(UserStoriesService.name);
  constructor(private prisma: PrismaService) {}

  async create(data: UserStoryDto, userId: number) {
    const exists = await this.prisma.userStory.findFirst({
      where: { title: data.title },
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
    return this.prisma.userStory.findMany({
      where,
    });
  }

  async findRealized(projectId: number) {
    return this.prisma.userStory.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        accepted: true,
      },
    });
  }

  async findUnrealizedWithoutSprint(projectId: number) {
    return this.prisma.userStory.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        sprintId: null,
        accepted: false,
      },
    });
  }

  async findUnrealizedWithSprint(projectId: number) {
    return this.prisma.userStory.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        NOT: {
          sprintId: null,
        },
        accepted: false,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.userStory.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(id: number, data: UserStoryDto, userId: number) {
    const userStory = await this.findOne(id);

    if (!userStory) {
      const message = 'User story not found.';
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    if (
      data.priority != userStory.priority ||
      data.businessValue != userStory.businessValue ||
      data.description != userStory.description ||
      data.points != userStory.points ||
      data.priority != userStory.priority ||
      data.title != userStory.title ||
      data.sprintId != userStory.sprintId ||
      data.projectId != userStory.projectId
    ) {
      if (userStory.sprintId != null || userStory.accepted) {
        const message = `User story can't be changed.`;
        this.logger.warn(message);
        throw new ForbiddenException(message);
      }
    }

    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });

    if (userId != project.projectOwnerId && userId != project.scrumMasterId) {
      const message = `User doesn't have access to the project.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.userStory.update({ where: { id }, data });
  }

  async remove(id: number, userId: number) {
    const userStory = await this.findOne(id);

    if (!userStory) {
      const message = 'User story not found.';
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    if (userStory.sprintId != null || userStory.accepted) {
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
        accepted: false,
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
