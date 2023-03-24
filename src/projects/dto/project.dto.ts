import { IsNotEmpty, IsInt, IsString, MinLength } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  documentation: string;

  @IsInt()
  projectOwnerId: number;

  @IsInt()
  scrumMasterId: number;
}
