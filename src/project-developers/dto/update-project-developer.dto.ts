import { IsNotEmpty, IsInt } from 'class-validator';

export class ProjectDeveloperDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  projectId: number;
}
