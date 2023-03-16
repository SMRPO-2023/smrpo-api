import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserStoryDto } from './dto/user-story.dto';

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
    where['deletedAt'] = null;
    return this.prisma.userStory.findMany({
      where,
    });
  }

  async findOne(id: number) {
    return this.prisma.userStory.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        acceptanceCriteria: true,
      },
    });
  }

  async update(id: number, data: UserStoryDto, userId: number) {
    const userStory = await this.findOne(id);

    if (userStory.sprintId != null || userStory.implemented) {
      const message = `User story can't be changed.`;
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
    return this.prisma.userStory.update({ where: { id }, data });
  }

  async remove(id: number, userId: number) {
    const userStory = await this.findOne(id);

    if (userStory.sprintId != null || userStory.implemented) {
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
}
