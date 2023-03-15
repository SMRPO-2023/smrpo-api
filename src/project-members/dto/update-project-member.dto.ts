import { ProjectMemberRole } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  project_role: ProjectMemberRole;
}
