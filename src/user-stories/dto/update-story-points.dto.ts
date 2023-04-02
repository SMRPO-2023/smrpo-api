import { IsInt, Max, Min } from 'class-validator';

export class UpdateStoryPointsDto {
  @IsInt()
  @Min(0.1)
  @Max(50)
  points: number;
}
