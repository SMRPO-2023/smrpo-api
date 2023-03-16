import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Project } from 'src/projects/models/project.model';
import { User } from 'src/users/models/user.model';
import { BaseModel } from '../../common/models/base.model';

export class ProjectDeveloper extends BaseModel {
  @ApiProperty({ type: Number })
  projectId: number;

  @ApiProperty({ type: () => Project })
  Project: Project;

  @ApiPropertyOptional({ type: Number })
  userId?: number;

  @ApiPropertyOptional({ type: () => User })
  User?: User;
}
