import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { UserStoriesService } from './user-stories.service';
import { UserStoryDto } from './dto/user-story.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { StoryListDto } from './dto/story-list.dto';
import { AcceptUserStoryDto } from './dto/accept-user-story.dto';
import { User } from '@prisma/client';

@Controller('user-stories')
@ApiTags('User stories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserStoriesController {
  constructor(private readonly userStoriesService: UserStoriesService) {}

  @Post()
  create(@Body() data: UserStoryDto, @UserEntity() user: User) {
    return this.userStoriesService.create(data, user.id);
  }

  @Get()
  @ApiQuery({ name: 'sprintId', required: false, type: Number })
  @ApiQuery({ name: 'project-id', required: false, type: Number })
  findAll(@Query('sprintId') sid?: string, @Query('project-id') pid?: string) {
    return this.userStoriesService.findAll(+pid, +sid);
  }

  @Get('get-addable')
  @ApiQuery({ name: 'project-id', required: true, type: Number })
  getAddable(@Query('project-id') projectId: number) {
    return this.userStoriesService.getAddable(projectId);
  }

  @Get('realized')
  @ApiQuery({ name: 'project-id', required: true, type: Number })
  findRealized(@Query('project-id') projectId: number) {
    return this.userStoriesService.findRealized(projectId);
  }

  @Get('unrealized-without-sprint')
  @ApiQuery({ name: 'project-id', required: true, type: Number })
  findUnrealized(@Query('project-id') projectId: number) {
    return this.userStoriesService.findUnrealizedWithoutSprint(projectId);
  }

  @Get('unrealized-with-sprint')
  @ApiQuery({ name: 'project-id', required: true, type: Number })
  findUnrealizedWithSprint(@Query('project-id') projectId: number) {
    return this.userStoriesService.findUnrealizedWithSprint(projectId);
  }

  @Get('future-releases')
  @ApiQuery({ name: 'project-id', required: true, type: Number })
  findFutureReleases(@Query('project-id') projectId: number) {
    return this.userStoriesService.findFutureReleases(projectId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userStoriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @UserEntity() user: User,
    @Body() updateUserStoryDto: UserStoryDto
  ) {
    return this.userStoriesService.update(+id, updateUserStoryDto, user.id);
  }

  @Post('accept/:id')
  accept(
    @Param('id', ParseIntPipe) id: number,
    @UserEntity() user: User,
    @Body() updateUserStoryDto: AcceptUserStoryDto
  ) {
    return this.userStoriesService.accept(+id, updateUserStoryDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserEntity() user: User) {
    return this.userStoriesService.remove(+id, user.id);
  }

  @Post('add-to-sprint')
  addStories(@Body() data: StoryListDto, @UserEntity() user: User) {
    return this.userStoriesService.addStoriesToSprint(data, user);
  }

  @Post('remove-from-sprint/:id')
  removeStoryFromSprint(
    @Param('id', ParseIntPipe) id: number,
    @UserEntity() user: User
  ) {
    return this.userStoriesService.removeStoryFromSprint(id, user);
  }
}
