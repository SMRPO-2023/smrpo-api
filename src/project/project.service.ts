import {BadRequestException, Injectable} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getProjects() {
    return this.prisma.project.findMany({ select: { deletedAt: null } });
  }

  async getProject(where: Prisma.ProjectWhereUniqueInput) {
    return this.prisma.project.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async createProject(data: Prisma.ProjectCreateInput) {
    return this.prisma.project.create({
      data,
    });
  }

  async updateProject(params: {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.ProjectUpdateInput;
  }) {
    const { where, data } = params;
    const project = await this.getProject(where);
    if (!project) {
      throw new BadRequestException('Object is deleted');
    }
    return this.prisma.project.update({
      data,
      where,
    });
  }

  async markDeleted(where: Prisma.ProjectWhereUniqueInput) {
    const project = await this.prisma.project.findUnique({ where });
    project.deletedAt = new Date();
    return this.prisma.project.update({
      data: project,
      where,
    });
  }
}
