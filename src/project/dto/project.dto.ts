import { IsNotEmpty, MinLength } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  documentation: string;
}
