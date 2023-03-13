import { IsNotEmpty } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  project_role: any;
}
