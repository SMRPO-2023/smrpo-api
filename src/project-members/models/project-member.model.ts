import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectMemberRole } from '@prisma/client';
import { Project } from 'src/project/models/project.model';
import { User } from 'src/users/models/user.model';
import { BaseModel } from '../../common/models/base.model';

export class ProjectMember extends BaseModel {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ enum: ProjectMemberRole, enumName: 'ProjectMemberRole' })
  projectRole: ProjectMemberRole = ProjectMemberRole.DEVELOPER;

  @ApiProperty({ type: Number })
  projectId: number;

  @ApiProperty({ type: () => Project })
  Project: Project;

  @ApiPropertyOptional({ type: Number })
  userId?: number;

  @ApiPropertyOptional({ type: () => User })
  User?: User;
}
