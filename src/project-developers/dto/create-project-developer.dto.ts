import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProjectDeveloperDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
