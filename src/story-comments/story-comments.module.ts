import { Module } from '@nestjs/common';
import { StoryCommentsService } from './story-comments.service';
import { StoryCommentsController } from './story-comments.controller';

@Module({
  controllers: [StoryCommentsController],
  providers: [StoryCommentsService]
})
export class StoryCommentsModule {}
