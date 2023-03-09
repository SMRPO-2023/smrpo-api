import { IsNotEmpty } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  project_role: any;
}
