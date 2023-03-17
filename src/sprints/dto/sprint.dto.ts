import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  Min,
  MinDate,
  MaxDate,
} from 'class-validator';

export class SprintDto {
  @IsNotEmpty()
  @IsDate()
  @MinDate(new Date('2023-03-1')) // Rough validation
  start: Date;

  @IsNotEmpty()
  @IsDate()
  @MaxDate(new Date('2024-01-1')) // Rough validation
  end: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Min(100)
  velocity: number;

  @IsOptional()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsNumber()
  userStoryId: number;
}
