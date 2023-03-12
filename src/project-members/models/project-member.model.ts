import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectMemberRole } from '@prisma/client';
import { Project } from 'src/projects/models/project.model';
import { User } from 'src/users/models/user.model';

export class ProjectMember {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Number })
  projectId: number;

  @ApiProperty({ enum: ProjectMemberRole, enumName: 'ProjectMemberRole' })
  projectRole: ProjectMemberRole = ProjectMemberRole.DEVELOPER;

  @ApiProperty({ type: () => Project })
  Project: Project;

  @ApiPropertyOptional({ type: () => User })
  User?: User;

  @ApiPropertyOptional({ type: Number })
  userId?: number;
}
