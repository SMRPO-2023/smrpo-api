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
import { UserStoriesService } from './user-stories.service';
import { UserStoryDto } from './dto/user-story.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';

@Controller('user-stories')
@ApiTags('Stories')
export class UserStoriesController {
  constructor(private readonly userStoriesService: UserStoriesService) {}

  @Post()
  create(@Body() data: UserStoryDto, @UserEntity() user: User) {
    return this.userStoriesService.create(data, user.id);
  }

  @Get()
  findAll() {
    return this.userStoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userStoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @UserEntity() user: User,
    @Body() updateUserStoryDto: UserStoryDto
  ) {
    return this.userStoriesService.update(+id, updateUserStoryDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserEntity() user: User) {
    return this.userStoriesService.remove(+id, user.id);
  }
}
