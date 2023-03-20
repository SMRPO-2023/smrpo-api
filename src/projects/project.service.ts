import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      where: { deletedAt: null },
      include: {
        developers: {
          select: {
            user: true,
          },
          where: {
            deletedAt: null,
          },
        },
        projectOwner: true,
        scrumMaster: true,
      },
    });
  }

  async findOne(where: Prisma.ProjectWhereUniqueInput) {
    return this.prisma.project.findFirstOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        UserStory: {
          where: {
            deletedAt: null,
          },
        },
        developers: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            user: true,
          },
        },
        sprints: {
          where: {
            deletedAt: null,
          },
        },
        posts: {
          where: {
            deletedAt: null,
          },
        },
        projectOwner: true,
        scrumMaster: true,
      },
    });
  }

  async create(data: Prisma.ProjectCreateInput) {
    const exists = await this.prisma.project.findFirst({
      where: { title: data.title },
    });
    if (exists) {
      const message = `Project already exists.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
    return this.prisma.project.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.ProjectUpdateInput;
  }) {
    const { where, data } = params;
    const project = await this.findOne(where);
    if (!project) {
      throw new BadRequestException('Object is deleted');
    }
    return this.prisma.project.update({
      data,
      where,
    });
  }

  async markDeleted(where: Prisma.ProjectWhereUniqueInput) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
    });
    project.deletedAt = new Date();
    return this.prisma.project.update({
      data: project,
      where,
    });
  }
}
