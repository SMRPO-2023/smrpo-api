import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  // Not required
  userId?: number;

  @IsNotEmpty()
  @IsInt()
  projectId: number;
}
