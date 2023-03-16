import { IsNotEmpty, IsNumber } from 'class-validator';

export class ProjectDeveloperDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
