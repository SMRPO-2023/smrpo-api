import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Project } from 'src/project/models/project.model';
import { User } from 'src/users/models/user.model';

export class Post {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => User })
  User?: User;

  @ApiPropertyOptional({ type: Number })
  userId?: number;

  @ApiPropertyOptional({ type: () => Project })
  Project?: Project;

  @ApiPropertyOptional({ type: Number })
  projectId?: number;
}
