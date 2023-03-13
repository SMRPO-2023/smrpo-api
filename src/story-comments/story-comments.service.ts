import { Injectable } from '@nestjs/common';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { UpdateStoryCommentDto } from './dto/update-story-comment.dto';

@Injectable()
export class StoryCommentsService {
  create(createStoryCommentDto: CreateStoryCommentDto) {
    return 'This action adds a new storyComment';
  }

  findAll() {
    return `This action returns all storyComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storyComment`;
  }

  update(id: number, updateStoryCommentDto: UpdateStoryCommentDto) {
    return `This action updates a #${id} storyComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} storyComment`;
  }
}
