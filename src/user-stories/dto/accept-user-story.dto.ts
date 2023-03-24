import { Transform, Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class AcceptUserStoryDto {
  @IsBoolean()
  @Type(() => Boolean)
  acceptanceTest: boolean;
}
