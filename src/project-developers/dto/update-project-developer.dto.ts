import { IsNotEmpty, IsNumber } from 'class-validator';

<<<<<<< HEAD:src/project-developers/dto/project-developer.dto.ts
export class ProjectDeveloperDto {
=======
export class UpdateProjectDeveloperDto {
>>>>>>> master:src/project-developers/dto/update-project-developer.dto.ts
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
