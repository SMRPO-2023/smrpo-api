import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from 'src/common/models/base.model';
import { IsEmail } from 'class-validator';
import { ProjectMember } from 'src/project-members/models/project-member.model';
import { StoryComment } from 'src/story-comments/models/story-comment.model';
import { Task } from 'src/tasks/models/task.model';
import { TimeLog } from 'src/time-logs/models/time-log.model';
import { Role } from './role.model';
import { Post } from 'src/posts/models/post.model';

export class User extends BaseModel {
  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiPropertyOptional({ type: String })
  firstname?: string;

  @ApiPropertyOptional({ type: String })
  lastname?: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role = Role.USER;

  @ApiProperty({ isArray: true, type: () => StoryComment })
  storyComment: StoryComment[];

  @ApiProperty({ isArray: true, type: () => ProjectMember })
  projects: ProjectMember[];

  @ApiProperty({ isArray: true, type: () => Task })
  tasks: Task[];

  @ApiProperty({ isArray: true, type: () => TimeLog })
  timeLogs: TimeLog[];

  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];
}
