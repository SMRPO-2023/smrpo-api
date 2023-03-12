import { Injectable } from '@nestjs/common';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';

@Injectable()
export class TimeLogsService {
  create(createTimeLogDto: CreateTimeLogDto) {
    return 'This action adds a new timeLog';
  }

  findAll() {
    return `This action returns all timeLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeLog`;
  }

  update(id: number, updateTimeLogDto: UpdateTimeLogDto) {
    return `This action updates a #${id} timeLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeLog`;
  }
}
