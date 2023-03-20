import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  documentation: string;

  @IsInt()
  projectOwnerId: number;

  @IsInt()
  scrumMasterId: number;
}
