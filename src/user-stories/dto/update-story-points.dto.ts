import { IsNumber, Max, Min } from 'class-validator';

export class UpdateStoryPointsDto {
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.1)
  @Max(50)
  points: number;
}
