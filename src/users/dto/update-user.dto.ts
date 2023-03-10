import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { Role } from '@prisma/client';
export class UpdateUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  role: Role;

  @IsNotEmpty()
  @MinLength(8)
  @IsOptional()
  password?: string;
  @IsOptional()
  firstname?: string;
  @IsOptional()
  lastname?: string;
}
