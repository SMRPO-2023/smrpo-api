import { StoryImportance } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateUserStoryDto {
  @IsNotEmpty()
  title: string;

  description: string;

  importance: StoryImportance = StoryImportance.LOW;

  @IsNotEmpty()
  points: number;

  @IsNotEmpty()
  realised: boolean;

  @IsNotEmpty()
  projectId?: number;

  @IsNotEmpty()
  sprintId?: number;

  acceptanceCriteriaId: number;
}
