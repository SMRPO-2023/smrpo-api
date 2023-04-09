import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @UserEntity() user: User) {
    return this.postsService.create(createPostDto, user?.id);
  }

  @Get()
  findAll(@Query('pid') projectId: string, @UserEntity() user: User) {
    return this.postsService.findAll(+projectId, user?.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserEntity() user: User) {
    return this.postsService.findOne(+id, user?.id);
  }

  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UserEntity() user: User
  ) {
    return this.postsService.update(+id, updatePostDto, user?.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserEntity() user: User) {
    return this.postsService.remove(+id, user?.id);
  }
}
