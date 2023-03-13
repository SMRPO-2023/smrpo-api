import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsAlpha,
  IsOptional,
} from 'class-validator';

export class SignupDto {
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

  @IsOptional()
  role: Role;
}
