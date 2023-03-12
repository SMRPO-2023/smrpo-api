import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoryCommentsService } from './story-comments.service';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { UpdateStoryCommentDto } from './dto/update-story-comment.dto';

@Controller('story-comments')
export class StoryCommentsController {
  constructor(private readonly storyCommentsService: StoryCommentsService) {}

  @Post()
  create(@Body() createStoryCommentDto: CreateStoryCommentDto) {
    return this.storyCommentsService.create(createStoryCommentDto);
  }

  @Get()
  findAll() {
    return this.storyCommentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storyCommentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryCommentDto: UpdateStoryCommentDto) {
    return this.storyCommentsService.update(+id, updateStoryCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyCommentsService.remove(+id);
  }
}
