import { ProjectMemberRole } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProjectMemberDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  project_role: ProjectMemberRole;
}
