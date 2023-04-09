import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  // Not required
  userId?: number;

  @IsNotEmpty()
  @IsInt()
  projectId: number;
}
