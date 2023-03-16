import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  Validate,
} from 'class-validator';
import { AlphaSpacesValidator } from 'src/common/validators/alpha-spaces.validator';

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
  @Validate(AlphaSpacesValidator)
  firstname?: string;

  @IsOptional()
  @Validate(AlphaSpacesValidator)
  lastname?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: Role, enumName: 'role' })
  role: Role;
}
