import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from 'src/common/models/base.model';
import { Task } from 'src/tasks/models/task.model';
import { User } from 'src/users/models/user.model';

export class TimeLog extends BaseModel {
  @ApiProperty({ type: Date })
  day: Date;

  @ApiProperty({ type: Number })
  hours: number;

  @ApiProperty({ type: Number })
  remainingHours: number;

  @ApiProperty({ type: () => User })
  User: User;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiProperty({ type: () => Task })
  Task: Task;

  @ApiProperty({ type: Number })
  taskId: number;
}
