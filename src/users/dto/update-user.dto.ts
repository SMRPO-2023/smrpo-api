import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsString,
} from 'class-validator';
export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  username: string;

  @IsOptional()
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
  @ApiProperty({ enum: Role, enumName: 'role' })
  role: Role;
}
