import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export class AcceptanceCriteriaService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AcceptanceCriteriaCreateInput) {
    const exists = await this.prisma.acceptanceCriteria.findFirst({
      where: { title: data.title },
    });
    if (exists) {
      throw new BadRequestException('Object with same name already exists');
    }
    return this.prisma.acceptanceCriteria.create({ data });
  }

  async findAll(userStoryId: number) {
    const where = { deletedAt: null };
    if (userStoryId) {
      where['userStoryId'] = userStoryId;
    }
    return this.prisma.acceptanceCriteria.findMany({ where });
  }

  async findOne(id: number) {
    return this.prisma.acceptanceCriteria.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, data: Prisma.AcceptanceCriteriaUpdateInput) {
    await this.findOne(id);
    return this.prisma.acceptanceCriteria.update({ where: { id }, data });
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
