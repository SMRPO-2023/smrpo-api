import { IsNotEmpty } from 'class-validator';

export class CreateProjectMemberDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  project_role: any;
}
