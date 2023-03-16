import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AcceptanceCriteriaDto } from './dto/acceptance-criteria.dto';

@Injectable()
export class AcceptanceCriteriaService {
  private readonly logger = new Logger(AcceptanceCriteriaService.name);
  constructor(private prisma: PrismaService) {}

  async create(data: AcceptanceCriteriaDto, userId: number) {
    const exists = await this.prisma.acceptanceCriteria.findFirst({
      where: { title: data.title },
    });
    if (exists) {
      const message = `Acceptance criteria already exists.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }
    const userStory = await this.prisma.userStory.findUnique({
      where: { id: data.userStoryId },
    });
    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });

    if (userId != project.projectOwnerId && userId != project.scrumMasterId) {
      const message = `User doesn't have access to the project.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.acceptanceCriteria.create({ data });
  }

  async findAll(userStoryId?: number) {
    const where = { deletedAt: null };
    if (userStoryId) {
      where['userStoryId'] = userStoryId;
    }
    return this.prisma.acceptanceCriteria.findMany({ where });
  }

  async findOne(id: number) {
    return this.prisma.acceptanceCriteria.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, data: AcceptanceCriteriaDto, userId: number) {
    await this.findOne(id);
    const userStory = await this.prisma.userStory.findUnique({
      where: { id: data.userStoryId },
    });
    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });

    if (userId != project.projectOwnerId && userId != project.scrumMasterId) {
      const message = `User doesn't have access to the project.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    return this.prisma.acceptanceCriteria.update({ where: { id }, data });
  }

  async remove(id: number, userId: number) {
    const acceptanceCriteria = await this.findOne(id);
    const userStory = await this.prisma.userStory.findUnique({
      where: { id: acceptanceCriteria.userStoryId },
    });
    const project = await this.prisma.project.findUnique({
      where: { id: userStory.projectId },
    });
    if (userId != project.projectOwnerId && userId != project.scrumMasterId) {
      const message = `User doesn't have access to the project.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }
    acceptanceCriteria.deletedAt = new Date();
    return this.prisma.acceptanceCriteria.update({
      where: { id },
      data: acceptanceCriteria,
    });
  }
}
