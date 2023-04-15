import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StoryCommentDto } from './dto/story-comment.dto';

@Injectable()
export class StoryCommentsService {
  private readonly logger = new Logger(StoryCommentsService.name);
  constructor(private prisma: PrismaService) {}

  create(data: StoryCommentDto) {
    return this.prisma.storyComment.create({ data });
  }

  findAll(userId?: number, storyId?: number) {
    const where = { deletedAt: null };
    if (userId) {
      where['userId'] = userId;
    }
    if (storyId) {
      where['userStoryId'] = storyId;
    }
    return this.prisma.storyComment.findMany({
      where,
    });
  }

  findOne(id: number) {
    return this.prisma.storyComment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(id: number, data: StoryCommentDto) {
    const storyComment = await this.findOne(id);

    if (!storyComment) {
      const message = 'Story comment not found.';
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    return this.prisma.storyComment.update({ where: { id }, data });
  }

  async remove(id: number) {
    const storyComment = await this.findOne(id);

    if (!storyComment) {
      const message = 'Story comment not found.';
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    storyComment.deletedAt = new Date();
    return this.prisma.storyComment.update({
      where: { id },
      data: storyComment,
    });
  }
}
