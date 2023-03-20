import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
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
  @IsString()
  firstname?: string;

  @IsString()
  lastname?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: Role, enumName: 'role' })
  role: Role;
}
