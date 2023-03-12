import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeLogsService } from './time-logs.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';

@Controller('time-logs')
export class TimeLogsController {
  constructor(private readonly timeLogsService: TimeLogsService) {}

  @Post()
  create(@Body() createTimeLogDto: CreateTimeLogDto) {
    return this.timeLogsService.create(createTimeLogDto);
  }

  @Get()
  findAll() {
    return this.timeLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeLogDto: UpdateTimeLogDto) {
    return this.timeLogsService.update(+id, updateTimeLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeLogsService.remove(+id);
  }
}
