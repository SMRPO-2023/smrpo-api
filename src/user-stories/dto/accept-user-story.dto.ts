import { IsInt, IsBoolean } from 'class-validator';

export class AcceptUserStoryDto {
  @IsBoolean()
  accepted: boolean;
}
