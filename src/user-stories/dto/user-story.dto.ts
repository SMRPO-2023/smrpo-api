import { ApiProperty } from '@nestjs/swagger';
import { StoryPriority } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class UserStoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: StoryPriority, enumName: 'StoryPriority' })
  priority: StoryPriority;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.1)
  @Max(50)
  points?: number;

  @IsOptional()
  @IsBoolean()
  acceptanceTest: boolean;

  @IsInt()
  projectId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  businessValue: number;

  @IsNotEmpty()
  @IsString()
  acceptanceCriteria: string;
}
