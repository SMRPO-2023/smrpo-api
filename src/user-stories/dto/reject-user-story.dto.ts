import { IsOptional, IsString } from 'class-validator';

export class RejectUserStoryDto {
  @IsOptional()
  @IsString()
  message: string;
}
