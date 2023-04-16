import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePostDto, userId: number) {
    if (!(await this.checkPermissions(userId, data.projectId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    data.userId = userId;
    return this.prisma.post.create({ data });
  }

  async findAll(projectId: number, userId: number) {
    if (!projectId) {
      const message = `There is no project id parameter.`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    const project = await this.prisma.project.findFirst({
      where: { id: projectId },
    });
    if (!project) {
      const message = `Project does not exist.`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }
    if (!(await this.checkPermissions(userId, projectId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    return this.prisma.post.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
        Project: {
          select: {
            title: true,
            projectOwnerId: true,
            scrumMasterId: true,
            developers: true,
          },
        }
      }
    });
  }

  async findOne(id: number, userId: number) {
    const post = await this.prisma.post.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!post || !(await this.checkPermissions(userId, post.projectId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    return this.prisma.post.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(id: number, data: UpdatePostDto, userId: number) {
    const post = await this.prisma.post.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!post || !(await this.checkPermissions(userId, post.projectId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    return this.prisma.post.update({
      data,
      where: { id },
    });
  }

  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!post || !(await this.checkPermissions(userId, post.projectId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    post.deletedAt = new Date();
    return this.prisma.post.update({
      data: post,
      where: {
        id,
      },
    });
  }

  async checkPermissions(userId, projectId) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: { id: projectId },
      include: { developers: { where: { projectId: projectId } } },
    });
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    // Users from the project can create posts
    return (
      user.role === 'ADMIN' ||
      project.scrumMasterId === userId ||
      project.projectOwnerId === userId ||
      project.developers.includes(userId)
    );
  }
}
