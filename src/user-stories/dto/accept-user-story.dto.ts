import { IsBoolean } from 'class-validator';

export class AcceptUserStoryDto {
  @IsBoolean()
  acceptanceTest: boolean;
}
