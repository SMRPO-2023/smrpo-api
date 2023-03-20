import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  Min,
  IsString,
  Max,
  IsDate,
  IsInt,
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
  @IsInt()
  @Min(0)
  @Max(100)
  velocity: number;

  @IsOptional()
  @IsInt()
  projectId: number;

  @IsString()
  @IsOptional()
  name: string;
}
