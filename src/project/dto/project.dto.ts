import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsOptional()
  documentation: string;
}
