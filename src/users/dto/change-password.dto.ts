import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
