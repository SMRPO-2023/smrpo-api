import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoryImportance } from '@prisma/client';
import { AcceptanceCriteria } from 'src/acceptance-criteries/models/acceptance-critery.model';
import { Project } from 'src/projects/models/project.model';
import { Sprint } from 'src/sprints/models/sprint.model';
import { StoryComment } from 'src/story-comments/models/story-comment.model';
import { Task } from 'src/tasks/models/task.model';

export class UserStory {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => Project })
  project?: Project;

  @ApiProperty({ isArray: true, type: () => Sprint })
  sprints: Sprint[];

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ enum: StoryImportance, enumName: 'StoryImportance' })
  importance: StoryImportance = StoryImportance.LOW;

  @ApiProperty({ type: Number })
  points: number;

  @ApiProperty({ type: Boolean })
  realised: boolean;

  @ApiPropertyOptional({ type: Number })
  projectId?: number;

  @ApiPropertyOptional({ type: Number })
  sprintId?: number;

  @ApiProperty({ type: () => AcceptanceCriteria })
  acceptanceCriteria: AcceptanceCriteria;

  @ApiProperty({ type: Number })
  acceptanceCriteriaId: number;

  @ApiProperty({ isArray: true, type: () => StoryComment })
  comments: StoryComment[];

  @ApiProperty({ isArray: true, type: () => Task })
  Task: Task[];
}
