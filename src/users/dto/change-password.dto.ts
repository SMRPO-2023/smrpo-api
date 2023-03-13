import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(128)
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(128)
  newPassword: string;
}
