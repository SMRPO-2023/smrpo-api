import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ type: String })
  title: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String })
  documentation: string;

  @IsOptional()
  @ApiPropertyOptional({ type: () => Number })
  projectOwnerId: number;

  @IsOptional()
  @ApiPropertyOptional({ type: () => Number })
  scrumMasterId: number;
}
