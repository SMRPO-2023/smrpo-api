import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoryPriority } from '@prisma/client';
import { BaseModel } from 'src/common/models/base.model';
import { Project } from 'src/projects/models/project.model';
import { Sprint } from 'src/sprints/models/sprint.model';
import { StoryComment } from 'src/story-comments/models/story-comment.model';
import { Task } from 'src/tasks/models/task.model';

export class UserStory extends BaseModel {
  @ApiProperty({ type: () => Project })
  project: Project;

  @ApiProperty({ isArray: true, type: () => Sprint })
  sprints: Sprint[];

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ enum: StoryPriority, enumName: 'StoryPriority' })
  priority: StoryPriority;

  @ApiPropertyOptional({ type: Number })
  points?: number;

  @ApiProperty({ type: Boolean })
  acceptanceTest: boolean;

  @ApiProperty({ type: Number })
  projectId: number;

  @ApiPropertyOptional({ type: Number })
  sprintId?: number;

  @ApiProperty({ type: String })
  acceptanceCriteria: string;

  @ApiProperty({ isArray: true, type: () => StoryComment })
  comments: StoryComment[];

  @ApiPropertyOptional({ isArray: true, type: () => Task })
  Task: Task[];

  @ApiPropertyOptional({ type: Number })
  businessValue: number;
}
