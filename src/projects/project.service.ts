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
            id: true,
            user: true,
          },
          where: {
            deletedAt: null,
          },
        },
        projectOwner: true,
        scrumMaster: true,
        UserStory: true,
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
      where: {
        deletedAt: null,
        title: {
          equals: data.title,
          mode: 'insensitive',
        },
      },
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
    if (data.title != null) {
      const exists = await this.prisma.project.findFirst({
        where: {
          deletedAt: null,
          NOT: { id: where.id },
          title: {
            equals: data.title.toString(),
            mode: 'insensitive',
          },
        },
      });

      if (exists) {
        const message = `Project already exists.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
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
