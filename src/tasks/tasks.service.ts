import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'nestjs-prisma';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectDeveloper, Role, Task, TaskStatus } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: CreateTaskDto, userId: number) {
    if (!(await this.checkPermissions(userId, data.userStoryId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    const userStory = await this.prisma.userStory.findFirstOrThrow({
      where: { id: data.userStoryId },
    });
    if (userStory.acceptanceTest) {
      const message = `UserStory is already completed.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }

    if (userStory?.sprintId) {
      const sprint = await this.prisma.sprint.findFirstOrThrow({
        where: { id: userStory?.sprintId },
      });
      if (!sprint) {
        const message = `Sprint is not assigned to the user story.`;
        this.logger.warn(message);
        throw new BadRequestException(message);
      }

      if (
        dayjs(sprint.start).isAfter(dayjs()) ||
        dayjs(sprint.end).isBefore(dayjs())
      ) {
        const message = `UserStory is not in active sprint.`;
        this.logger.warn(message);
        throw new BadRequestException(message);
      }
    }

    const exists = await this.prisma.task.findFirst({
      where: {
        deletedAt: null,
        userStoryId: data.userStoryId,
        title: {
          equals: data.title,
          mode: 'insensitive',
        },
      },
    });

    if (exists) {
      const message = `Task already exists.`;
      this.logger.warn(message);
      throw new ConflictException(message);
    }

    return this.prisma.task.create({ data });
  }

  async findAll(userStoryId?: number, userId?: number, status?: string) {
    const where = { deletedAt: null };
    if (status) {
      if (status === 'FINISHED') {
        // Where remaining is equal 0
        // where['timeLogs'] = {
        //   some: { remainingHours: 0 },
        //   every: { deletedAt: null },
        // };
        where['NOT'] = { status: 'UNASSIGNED' };
      } else if (status === 'ACTIVE') {
        // Where remaining is greater than 0
        // where['timeLogs'] = {
        //   every: {
        //     remainingHours: { gt: 0 },
        //     deletedAt: null,
        //   },
        // };
        where['NOT'] = { status: 'UNASSIGNED' };
      } else if (status === 'ALL') {
      } else {
        where['status'] = TaskStatus[status];
      }
    }
    if (userStoryId) {
      where['userStoryId'] = userStoryId;
    }
    if (userId) {
      where['userId'] = userId;
    }
    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        UserStory: {
          select: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            title: true,
            description: true,
            priority: true,
            points: true,
            acceptanceTest: true,
            projectId: true,
            sprintId: true,
            acceptanceCriteria: true,
            businessValue: true,
          },
        },
        timeLogs: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            day: true,
            hours: true,
            userId: true,
            taskId: true,
            remainingHours: true,
          },
          where: { deletedAt: null },
        },
        assignedTo: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            lastLogin: true,
            username: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });

    // TODO: fix hours and done calculations
    return tasks
      .filter((t) => {
        if (status === 'FINISHED') {
          return !!t.timeLogs.filter((tl) => tl.remainingHours === 0).length;
        } else if (status === 'ACTIVE') {
          return !t.timeLogs.filter((tl) => tl.remainingHours === 0).length;
        }
        return true;
      })
      .map((t) => {
        return {
          ...t,
          done: !!t?.timeLogs?.filter((tl) => tl.remainingHours === 0).length,
        };
      });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        UserStory: {
          select: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            title: true,
            description: true,
            priority: true,
            points: true,
            acceptanceTest: true,
            projectId: true,
            sprintId: true,
            acceptanceCriteria: true,
            businessValue: true,
          },
        },
        timeLogs: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            day: true,
            hours: true,
            userId: true,
            taskId: true,
            remainingHours: true,
          },
          where: { deletedAt: null },
        },
        assignedTo: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            lastLogin: true,
            username: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });

    // TODO: fix hours and done calculations
    task['done'] = !!task?.timeLogs?.filter((tl) => tl.remainingHours === 0)
      .length;
    return task;
  }

  async update(id: number, data: UpdateTaskDto, userId: number) {
    if (!(await this.checkPermissions(userId, data.userStoryId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    return this.prisma.task.update({
      data,
      where: { id },
    });
  }

  async userAction(id: number, action: string, userId: number) {
    const task = await this.prisma.task.findFirstOrThrow({
      where: { id },
    });
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    if (
      user.role !== Role.ADMIN &&
      task.userId !== null &&
      userId !== task.userId
    ) {
      const message = `Cannot change other's task assignment.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    if (action === 'assign') {
      task.status = TaskStatus.ASSIGNED;
      task.userId = userId;
    } else if (action === 'accept') {
      task.status = TaskStatus.ACCEPTED;
      task.userId = userId;
    } else if (action === 'reject') {
      task.status = TaskStatus.UNASSIGNED;
      task.userId = null;
    }

    await this.prisma.task.update({ where: { id }, data: task });
    // must return task with included data
    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!(await this.checkPermissions(userId, task.userStoryId))) {
      const message = `User does not have sufficient permissions.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    if (
      task.status === TaskStatus.ACCEPTED ||
      task.status === TaskStatus.ASSIGNED ||
      !!task.userId
    ) {
      const message = `Task cannot be deleted until assignee rejects the task.`;
      this.logger.warn(message);
      throw new UnauthorizedException(message);
    }

    task.deletedAt = new Date();
    return this.prisma.task.update({
      data: task,
      where: {
        id,
      },
    });
  }

  async checkPermissions(
    userId: number,
    userStoryId: number,
    developers = true
  ) {
    const userStory = await this.prisma.userStory.findFirstOrThrow({
      where: { id: userStoryId },
    });
    const project = await this.prisma.project.findFirstOrThrow({
      where: {
        id: userStory.projectId,
      },
      include: { developers: { where: { projectId: userStory.projectId } } },
    });
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    return (
      user.role === 'ADMIN' ||
      userId === project.scrumMasterId ||
      (developers &&
        project.developers.map((d: ProjectDeveloper) => d.userId).includes(userId))
    );
  }
}
