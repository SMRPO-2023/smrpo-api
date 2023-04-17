import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
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
  estimate: number;

  @IsNotEmpty()
  @IsInt()
  userStoryId: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  status?: TaskStatus;
}
