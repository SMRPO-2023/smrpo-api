import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(128)
  password: string;
}
