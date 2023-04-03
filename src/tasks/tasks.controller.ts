import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @UserEntity() user: User) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  findAll(@Query('usid') userStoryId: string) {
    return this.tasksService.findAll(+userStoryId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserEntity() user: User
  ) {
    return this.tasksService.update(+id, updateTaskDto, user.id);
  }

  @Post(':id/:action')
  accept_reject(
    @Param('id', ParseIntPipe) id: number,
    @Param('action') action: string,
    @UserEntity() user: User
  ) {
    return this.tasksService.userAction(+id, action, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserEntity() user: User) {
    return this.tasksService.remove(+id, user.id);
  }
}
