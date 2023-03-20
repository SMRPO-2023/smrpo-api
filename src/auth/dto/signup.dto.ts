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
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  firstname?: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  lastname?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: Role, enumName: 'role' })
  role: Role;
}
