import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role, User } from '@prisma/client';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(private prisma: PrismaService) {}

  async findAll(user: User) {
    let where = {};
    if (user.role != 'ADMIN') {
      where = {
        deletedAt: null,
        OR: [
          { scrumMasterId: user.id },
          { projectOwnerId: user.id },
          { developers: { some: { userId: user.id } } },
        ],
      };
    } else {
      where = { deletedAt: null };
    }
    return this.prisma.project.findMany({
      where: where,
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

  async create(data: ProjectDto) {
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

    if (data.projectOwnerId == data.scrumMasterId) {
      const message = `The same person can't be project owner and scrum master.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }

    return this.prisma.project.create({
      data,
    });
  }

  async update(data: ProjectDto, projectId: number, user: User) {
    const where = { id: projectId };
    const project = await this.findOne(where);
    if (!project) {
      throw new BadRequestException('Object is deleted');
    }
    if (user.id !== project.scrumMasterId && user.role !== Role.ADMIN) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    if (data.title != null) {
      const exists = await this.prisma.project.findFirst({
        where: {
          deletedAt: null,
          NOT: where,
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

    if (data.projectOwnerId != null && data.scrumMasterId != null) {
      if (data.projectOwnerId === data.scrumMasterId) {
        const message = `The same person can't be project owner and scrum master.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
    }

    if (data.projectOwnerId != null) {
      const developerExists = await this.prisma.projectDeveloper.findMany({
        where: {
          projectId: project.id,
          userId: data.projectOwnerId,
          deletedAt: null,
        },
      });
      console.log(developerExists);
      if (developerExists.length > 0) {
        const message = `The project owner can't be a developer.`;
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
