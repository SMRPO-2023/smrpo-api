import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @MinLength(3)
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(128)
  password: string;
}
