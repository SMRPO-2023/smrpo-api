import { Role } from '@prisma/client';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
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
