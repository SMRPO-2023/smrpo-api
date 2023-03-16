import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProjectDeveloperDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
