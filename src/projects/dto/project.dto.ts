import {
  IsNotEmpty,
  IsNumber,
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

  @IsOptional()
  @IsNumber()
  projectOwnerId: number;

  @IsOptional()
  @IsNumber()
  scrumMasterId: number;
}
