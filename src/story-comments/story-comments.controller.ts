import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { StoryCommentsService } from './story-comments.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { StoryCommentDto } from './dto/story-comment.dto';

@Controller('story-comments')
@ApiTags('User story comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StoryCommentsController {
  constructor(private readonly storyCommentsService: StoryCommentsService) {}

  @Post()
  create(@Body() storyCommentDto: StoryCommentDto) {
    return this.storyCommentsService.create(storyCommentDto);
  }

  @Get()
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'userStoryId', required: false, type: Number })
  findAll(
    @Query('userId') userId?: number,
    @Query('userStoryId') storyId?: number
  ) {
    return this.storyCommentsService.findAll(userId, storyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storyCommentsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() storyCommentDto: StoryCommentDto
  ) {
    return this.storyCommentsService.update(+id, storyCommentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storyCommentsService.remove(+id);
  }
}
