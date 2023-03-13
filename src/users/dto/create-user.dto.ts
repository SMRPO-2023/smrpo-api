import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsAlpha,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsAlpha()
  firstname?: string;

  @IsOptional()
  @IsAlpha()
  lastname?: string;
}
