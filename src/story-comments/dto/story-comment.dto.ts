import { IsInt, IsString } from 'class-validator';

export class StoryCommentDto {
  @IsString()
  message: string;

  @IsInt()
  userId: number;

  @IsInt()
  userStoryId: number;
}
