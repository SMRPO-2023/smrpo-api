import { Injectable } from '@nestjs/common';
import { TimeLogDto } from './dto/time-log.dto';

@Injectable()
export class TimeLogsService {
  create(timeLogDto: TimeLogDto) {
    return 'This action adds a new timeLog';
  }

  findAll() {
    return `This action returns all timeLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeLog`;
  }

  update(id: number, timeLogDto: TimeLogDto) {
    return `This action updates a #${id} timeLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeLog`;
  }
}
