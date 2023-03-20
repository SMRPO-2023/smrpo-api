import { ApiProperty } from '@nestjs/swagger';
import { StoryPriority } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UserStoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ enum: StoryPriority, enumName: 'StoryPriority' })
  priority: StoryPriority;

  @IsNotEmpty()
  @IsInt()
  @Min(0.1)
  @Max(20)
  points: number;

  @IsOptional()
  implemented: boolean;

  @IsInt()
  projectId: number;

  @IsOptional()
  @IsInt()
  sprintId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  businessValue: number;
}
