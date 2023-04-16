import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from 'src/common/models/base.model';
import { UserStory } from 'src/user-stories/models/user-story.model';
import { User } from 'src/users/models/user.model';

export class StoryComment extends BaseModel {
  @ApiProperty({ type: Number })
  userStoryId: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: () => User })
  User: User;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiProperty({ type: () => UserStory })
  UserStory: UserStory;
}
