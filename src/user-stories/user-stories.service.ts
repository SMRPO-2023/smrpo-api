import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserStoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserStoryCreateInput) {
    const exists = await this.prisma.userStory.findFirst({
      where: { title: data.title },
    });
    if (exists) {
      throw new BadRequestException('Object with same name already exists');
    }
    return this.prisma.userStory.create({ data });
  }

  async findAll(projectId?: number, sprintId?: number) {
    const where = { deletedAt: null };
    if (projectId) {
      where['projectId'] = projectId;
    }
    if (sprintId) {
      where['sprintId'] = sprintId;
    }
    return this.prisma.userStory.findMany({
      where,
    });
  }

  async findOne(id: number) {
    return this.prisma.userStory.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, data: Prisma.UserStoryUpdateInput) {
    await this.findOne(id);
    return this.prisma.userStory.update({ where: { id }, data });
  }

  async remove(id: number) {
    const story = await this.findOne(id);
    story.deletedAt = new Date();
    return this.prisma.project.update({
      where: { id },
      data: story,
    });
  }
}
