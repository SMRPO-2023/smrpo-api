import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  Validate,
} from 'class-validator';
import { AlphaSpacesValidator } from '../../common/validators/alpha-spaces.validator';

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
  @Validate(AlphaSpacesValidator)
  firstname?: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @Validate(AlphaSpacesValidator)
  lastname?: string;
}
