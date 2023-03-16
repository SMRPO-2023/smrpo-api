import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { ProjectDeveloperDto } from './dto/project-developer.dto';
import { ProjectDevelopersDto } from './dto/project-developers.dto';

@Injectable()
export class ProjectDevelopersService {
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
    return this.prisma.projectDeveloper.create({ data });
  }

  async createMulti(data: ProjectDevelopersDto) {
    for (const member of data.developers) {
      await this.create(member);
    }
  }

  async update(
    where: Prisma.ProjectDeveloperWhereUniqueInput,
    data: Prisma.ProjectDeveloperUpdateInput
  ) {
    const member = await this.findOne(where);
    if (!member) {
      throw new BadRequestException('Object is deleted');
    }
    return this.prisma.projectDeveloper.update({
      data,
      where,
    });
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
}
