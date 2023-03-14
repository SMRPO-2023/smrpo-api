import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Project } from 'src/project/models/project.model';
import { UserStory } from 'src/user-stories/models/user-story.model';

export class Sprint {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: Number })
  velocity: number;

  @ApiPropertyOptional({ type: () => Project })
  Project?: Project;

  @ApiPropertyOptional({ type: Number })
  projectId?: number;

  @ApiPropertyOptional({ type: () => UserStory })
  UserStory?: UserStory;

  @ApiPropertyOptional({ type: Number })
  userStoryId?: number;
}
