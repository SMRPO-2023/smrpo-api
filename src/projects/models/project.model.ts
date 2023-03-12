import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Post } from 'src/posts/models/post.model';
import { ProjectMember } from 'src/project-members/models/project-member.model';
import { Sprint } from 'src/sprints/models/sprint.model';
import { UserStory } from 'src/user-stories/models/user-story.model';

export class Project {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  documentation?: string;

  @ApiProperty({ isArray: true, type: () => Sprint })
  sprints: Sprint[];

  @ApiProperty({ isArray: true, type: () => ProjectMember })
  members: ProjectMember[];

  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];

  @ApiProperty({ isArray: true, type: () => UserStory })
  UserStory: UserStory[];
}
