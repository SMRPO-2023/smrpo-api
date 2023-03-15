import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { CreateProjectMembersDto } from './dto/create-project-members.dto';

@Injectable()
export class ProjectMembersService {
  constructor(private prisma: PrismaService) {}

  async findAll(pid?: number) {
    const where = {
      deletedAt: null,
    };
    if (pid) {
      where['projectId'] = pid;
    }
    return this.prisma.projectMember.findMany({ where });
  }

  async findOne(where: Prisma.ProjectMemberWhereUniqueInput) {
    return this.prisma.projectMember.findFirstOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateProjectMemberDto) {
    this.prisma.project.findFirstOrThrow({
      where: {
        id: data?.projectId,
      },
    });
    return this.prisma.projectMember.create({ data });
  }

  async createMulti(data: CreateProjectMembersDto) {
    for (const member of data.members) {
      await this.create(member);
    }
  }

  async update(
    where: Prisma.ProjectMemberWhereUniqueInput,
    data: Prisma.ProjectMemberUpdateInput
  ) {
    const member = await this.findOne(where);
    if (!member) {
      throw new BadRequestException('Object is deleted');
    }
    return this.prisma.projectMember.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.ProjectMemberWhereUniqueInput) {
    const data = await this.prisma.projectMember.findFirstOrThrow({
      where: {
        ...where,
        deletedAt: null,
      },
    });
    data.deletedAt = new Date();
    return this.prisma.projectMember.update({
      data,
      where,
    });
  }
}
