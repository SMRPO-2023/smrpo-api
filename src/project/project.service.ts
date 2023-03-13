import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({ where: { deletedAt: null } });
  }

  async findOne(where: Prisma.ProjectWhereUniqueInput) {
    return this.prisma.project.findFirstOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async create(data: Prisma.ProjectCreateInput) {
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
