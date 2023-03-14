import { ApiProperty } from '@nestjs/swagger';
import { UserStory } from 'src/user-stories/models/user-story.model';

export class AcceptanceCriteria {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Number })
  userStoryId: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Boolean })
  completed: boolean;

  @ApiProperty({ isArray: true, type: () => UserStory })
  UserStory: UserStory[];
}
