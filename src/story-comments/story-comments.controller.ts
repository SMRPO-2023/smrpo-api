import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { StoryCommentsService } from './story-comments.service';
import { CreateStoryCommentDto } from './dto/create-story-comment.dto';
import { UpdateStoryCommentDto } from './dto/update-story-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('story-comments')
@ApiTags('Stories')
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storyCommentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoryCommentDto: UpdateStoryCommentDto
  ) {
    return this.storyCommentsService.update(+id, updateStoryCommentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storyCommentsService.remove(+id);
  }
}
