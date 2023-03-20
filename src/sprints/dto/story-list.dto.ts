import { IsNotEmpty } from 'class-validator';

export class StoryListDto {
  @IsNotEmpty()
  sprintId: number;

  @IsNotEmpty()
  stories: number[];
}
