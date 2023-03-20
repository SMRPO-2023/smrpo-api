import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  username: string;

  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(128)
  password: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  firstname?: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  lastname?: string;
}
