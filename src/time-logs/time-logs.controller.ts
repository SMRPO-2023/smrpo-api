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
import { TimeLogsService } from './time-logs.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TimeLogDto } from './dto/time-log.dto';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';

@Controller('time-logs')
@ApiTags('Time logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimeLogsController {
  constructor(private readonly timeLogsService: TimeLogsService) {}

  @Post('log-hours')
  logHours(@Body() timeLogDto: TimeLogDto, @UserEntity() user: User) {
    return this.timeLogsService.logHours(timeLogDto, user);
  }

  @Get()
  @ApiQuery({ name: 'task-id', required: false, type: Number })
  @ApiQuery({ name: 'user-id', required: false, type: Number })
  findAll(
    @UserEntity() user: User,
    @Query('task-id') taskId?: number,
    @Query('user-id') userId?: number
  ) {
    return this.timeLogsService.findAll(user, taskId, userId);
  }

  @Put(':id')
  update(
    @UserEntity() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() timeLogDto: TimeLogDto
  ) {
    return this.timeLogsService.update(+id, timeLogDto, user);
  }

  @Delete(':id')
  remove(@UserEntity() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.timeLogsService.remove(+id, user);
  }
}
