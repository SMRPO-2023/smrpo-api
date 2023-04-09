import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.1)
  hours: number;

  @IsNotEmpty()
  @IsInt()
  userStoryId: number;

  userId?: number;

  status?: TaskStatus;
}
