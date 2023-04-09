import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  Min,
  IsString,
  Max,
  IsDate,
  IsInt,
  IsNumber,
} from 'class-validator';

export class SprintDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end: Date;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.1)
  @Max(100)
  velocity: number;

  @IsOptional()
  @IsInt()
  projectId: number;

  @IsString()
  @IsOptional()
  name: string;
}
