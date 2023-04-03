import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { TimeLog } from 'src/time-logs/models/time-log.model';
import { UserStory } from 'src/user-stories/models/user-story.model';
import { User } from 'src/users/models/user.model';

export class Task {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  hours: number;

  @ApiPropertyOptional({ type: Boolean })
  done: boolean;

  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  status: TaskStatus = TaskStatus.UNASSIGNED;

  @ApiPropertyOptional({ type: () => User })
  assignedTo?: User;

  @ApiPropertyOptional({ type: Number })
  userId?: number;

  @ApiProperty({ isArray: true, type: () => TimeLog })
  timeLogs: TimeLog[];

  @ApiPropertyOptional({ type: () => UserStory })
  userStory?: UserStory;

  @ApiPropertyOptional({ type: Number })
  userStoryId?: number;
}
