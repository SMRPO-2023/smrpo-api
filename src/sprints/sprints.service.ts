import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SprintDto } from './dto/sprint.dto';
import { PrismaService } from 'nestjs-prisma';
import { Sprint } from '@prisma/client';

@Injectable()
export class SprintsService {
  private readonly logger = new Logger(SprintsService.name);
  constructor(private prisma: PrismaService) {}
  async create(data: SprintDto) {
    if (this.getDaysDelta(data.start, new Date()) < 1) {
      const message = `Sprint doesn't start in the future.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    if (this.getDaysDelta(data.end, data.start) < 0) {
      const message = `Sprint ends before it starts.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }
    if (await this.checkConflict(data)) {
      const message = `Sprint overlaps with another sprint.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
    return this.prisma.sprint.create({ data });
  }

  findAll() {
    const where = { deletedAt: null };
    return this.prisma.sprint.findMany({
      where,
    });
  }

  findOne(id: number) {
    return this.prisma.sprint.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(id: number, data: SprintDto) {
    const oldSprint = await this.findOne(id);
    if (oldSprint.start != data.start || oldSprint.end != data.end) {
      if (this.getDaysDelta(data.start, new Date()) < 1) {
        const message = `Sprint doesn't start in the future.`;
        this.logger.warn(message);
        throw new BadRequestException(message);
      }
      if (this.getDaysDelta(data.end, data.start) < 0) {
        const message = `Sprint ends before it starts.`;
        this.logger.warn(message);
        throw new BadRequestException(message);
      }
      if (await this.checkConflict(data)) {
        const message = `Sprint overlaps with another sprint.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
    }

    return this.prisma.sprint.update({ data: { ...data }, where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} sprint`;
  }

  getDaysDelta(date_1: Date, date_2: Date): number {
    const difference = date_1.getTime() - date_2.getTime();
    const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  }

  async checkConflict(data: SprintDto): Promise<Sprint> {
    this.logger.debug('checking sprint conflict.');
    const response = await this.prisma.sprint.findFirst({
      where: {
        projectId: data.projectId,
        OR: [
          {
            start: {
              gte: data.start,
              lte: data.end,
            },
          },
          {
            end: {
              gte: data.start,
              lte: data.end,
            },
          },
        ],
      },
    });
    console.log(response);
    return response;
  }
}
