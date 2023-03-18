import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsString,
  Max,
  IsDate,
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
  @IsNumber()
  @Min(0)
  @Max(100)
  velocity: number;

  @IsOptional()
  @IsNumber()
  projectId: number;

  @IsString()
  @IsOptional()
  name: string;
}
