import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Task } from 'src/tasks/models/task.model';
import { User } from 'src/users/models/user.model';

export class TimeLog {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  day: Date;

  @ApiProperty({ type: Number })
  hours: number;

  @ApiPropertyOptional({ type: () => User })
  User?: User;

  @ApiPropertyOptional({ type: Number })
  userId?: number;

  @ApiPropertyOptional({ type: () => Task })
  Task?: Task;

  @ApiPropertyOptional({ type: Number })
  taskId?: number;
}
