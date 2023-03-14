import { IsNotEmpty } from 'class-validator';

export class CreateAcceptanceCriteriaDto {
  @IsNotEmpty()
  userStoryId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  completed: boolean;
}
