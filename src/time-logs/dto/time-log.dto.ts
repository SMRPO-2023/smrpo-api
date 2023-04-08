import { Type } from 'class-transformer';
import { IsNotEmpty, Min, Max, IsDate, IsInt } from 'class-validator';

export class TimeLogDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  day: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(0.01)
  @Max(15)
  hours: number;

  @IsInt()
  userId: number;

  @IsInt()
  taskId: number;
}
