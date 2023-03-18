import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from 'src/common/models/base.model';
import { Post } from 'src/posts/models/post.model';
import { ProjectDeveloper } from 'src/project-developers/models/project-developer.model';
import { Sprint } from 'src/sprints/models/sprint.model';
import { UserStory } from 'src/user-stories/models/user-story.model';
import { User } from 'src/users/models/user.model';

export class Project extends BaseModel {
  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  documentation?: string;

  @ApiProperty({ isArray: true, type: () => Sprint })
  sprints: Sprint[];

  @ApiProperty({ isArray: true, type: () => ProjectDeveloper })
  developers: ProjectDeveloper[];

  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];

  @ApiProperty({ isArray: true, type: () => UserStory })
  UserStory: UserStory[];

  @ApiPropertyOptional({ type: () => User })
  projectOwner?: User;

  @ApiPropertyOptional({ type: () => User })
  scrumMaster?: User;
}
