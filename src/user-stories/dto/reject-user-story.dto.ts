import { IsNotEmpty, IsString } from 'class-validator';

export class RejectUserStoryDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
