import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0.1)
  hours: number;

  @IsNotEmpty()
  @IsInt()
  userStoryId: number;

  userId?: number;
}
