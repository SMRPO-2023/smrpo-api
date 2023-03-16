import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModel } from 'src/common/models/base.model';
import { UserStory } from 'src/user-stories/models/user-story.model';

export class AcceptanceCriteria extends BaseModel {
  @ApiProperty({ type: Number })
  userStoryId: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiPropertyOptional({ type: Boolean })
  completed: boolean;

  @ApiProperty({ isArray: true, type: () => UserStory })
  UserStory: UserStory[];
}