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
import { TimeLogsService } from './time-logs.service';
import { ApiTags } from '@nestjs/swagger';
import { TimeLogDto } from './dto/time-log.dto';

@Controller('time-logs')
@ApiTags('Time logs')
export class TimeLogsController {
  constructor(private readonly timeLogsService: TimeLogsService) {}

  @Post()
  create(@Body() timeLogDto: TimeLogDto) {
    return this.timeLogsService.create(timeLogDto);
  }

  @Get()
  findAll() {
    return this.timeLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.timeLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() timeLogDto: TimeLogDto
  ) {
    return this.timeLogsService.update(+id, timeLogDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timeLogsService.remove(+id);
  }
}
