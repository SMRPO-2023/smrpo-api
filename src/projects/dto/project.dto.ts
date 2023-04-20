import {
  IsNotEmpty,
  IsInt,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  documentation: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  projectOwnerId: number;

  @IsInt()
  scrumMasterId: number;
}
