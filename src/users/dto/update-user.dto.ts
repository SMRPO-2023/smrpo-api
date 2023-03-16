import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { AlphaSpacesValidator } from 'src/common/validators/alpha-spaces.validator';
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
  @Validate(AlphaSpacesValidator)
  firstname?: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @Validate(AlphaSpacesValidator)
  lastname?: string;

  @IsOptional()
  @ApiProperty({ enum: Role, enumName: 'role' })
  role: Role;
}
