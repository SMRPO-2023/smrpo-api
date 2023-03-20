import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateProjectDeveloperDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  projectId: number;
}
