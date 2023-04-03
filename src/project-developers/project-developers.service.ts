import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role, User } from '@prisma/client';
import { ProjectDeveloperDto } from './dto/project-developer.dto';
import { ProjectDevelopersDto } from './dto/project-developers.dto';

@Injectable()
export class ProjectDevelopersService {
  private readonly logger = new Logger(ProjectDevelopersService.name);
  constructor(private prisma: PrismaService) {}

  async findAll(projectId: number, user: User) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id: projectId,
        deletedAt: null,
      },
    });
    if (
      user.id !== project.scrumMasterId &&
      user.id !== project.projectOwnerId &&
      user.role !== Role.ADMIN
    ) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.projectDeveloper.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
      },
    });
  }

  async create(data: ProjectDeveloperDto, user: User) {
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id: data.projectId,
        deletedAt: null,
      },
    });
    if (
      user.id !== project.scrumMasterId &&
      user.id !== project.projectOwnerId &&
      user.role !== Role.ADMIN
    ) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    if (project.projectOwnerId == data.userId) {
      const message = `The project owner can't be a developer.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
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
      throw new BadRequestException(e);
    });
  }

  async createMulti(data: ProjectDevelopersDto, user: User) {
    try {
      for (const member of data.developers) {
        await this.create(member, user);
      }
    } catch (e) {
      return e;
    }
  }

  async remove(id: number, user: User) {
    const projectDeveloper =
      await this.prisma.projectDeveloper.findFirstOrThrow({
        where: { id, deletedAt: null },
      });
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id: projectDeveloper.projectId,
        deletedAt: null,
      },
    });
    if (
      user.id !== project.scrumMasterId &&
      user.id !== project.projectOwnerId &&
      user.role !== Role.ADMIN
    ) {
      const message = `Missing access rights.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    projectDeveloper.deletedAt = new Date();
    return this.prisma.projectDeveloper.update({
      data: projectDeveloper,
      where: {
        id,
      },
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
