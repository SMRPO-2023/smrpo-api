import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { StoryPriority } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  points: number;

  @IsOptional()
  implemented: boolean;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @IsNumber()
  sprintId?: number;

  @IsOptional()
  @IsString()
  businessValue: string;
}
