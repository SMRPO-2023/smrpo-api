import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from 'src/common/models/base.model';
import { Project } from 'src/projects/models/project.model';
import { UserStory } from 'src/user-stories/models/user-story.model';

export class Sprint extends BaseModel {
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

  @ApiProperty({ isArray: true, type: () => UserStory })
  UserStory: UserStory[];

  @ApiPropertyOptional({ type: String })
  name?: string;
}
