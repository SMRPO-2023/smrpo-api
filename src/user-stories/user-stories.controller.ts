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
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';

@Controller('user-stories')
export class UserStoriesController {
  constructor(private readonly userStoriesService: UserStoriesService) {}

  @Post()
  create(@Body() createUserStoryDto: CreateUserStoryDto) {
    return this.userStoriesService.create(createUserStoryDto);
  }

  @Get()
  findAll() {
    return this.userStoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userStoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserStoryDto: UpdateUserStoryDto
  ) {
    return this.userStoriesService.update(+id, updateUserStoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userStoriesService.remove(+id);
  }
}
