import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { ProjectDeveloperDto } from './dto/project-developer.dto';
import { ProjectDevelopersDto } from './dto/project-developers.dto';

@Injectable()
export class ProjectDevelopersService {
  private readonly logger = new Logger(ProjectDevelopersService.name);
  constructor(private prisma: PrismaService) {}

  async findAll(pid?: number) {
    const where = {
      deletedAt: null,
    };
    if (pid) {
      where['projectId'] = pid;
    }
    return this.prisma.projectDeveloper.findMany({ where });
  }

  async findOne(where: Prisma.ProjectDeveloperWhereUniqueInput) {
    return this.prisma.projectDeveloper.findFirstOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async create(data: ProjectDeveloperDto) {
    this.prisma.project.findFirstOrThrow({
      where: {
        id: data?.projectId,
      },
    });
    const deletedUser = await this.checkDeletedUser(data);
    if (deletedUser) {
      return this.prisma.projectDeveloper.update({
        where: {
          id: deletedUser.id,
        },
        data: { deletedAt: null },
      });
    }
    return this.prisma.projectDeveloper.create({ data }).catch((e) => {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const message = `User is already on the project.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
    });
  }

  async createMulti(data: ProjectDevelopersDto) {
    try {
      for (const member of data.developers) {
        await this.create(member);
      }
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const message = `User is already on the project.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
    }
  }

  async remove(where: Prisma.ProjectDeveloperWhereUniqueInput) {
    const data = await this.prisma.projectDeveloper.findFirstOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
    });
    data.deletedAt = new Date();
    return this.prisma.projectDeveloper.update({
      data,
      where,
    });
  }

  async checkDeletedUser(data: ProjectDeveloperDto) {
    return this.prisma.projectDeveloper.findFirst({
      where: {
        ...data,
        deletedAt: {
          not: null,
        },
      },
    });
  }
}
