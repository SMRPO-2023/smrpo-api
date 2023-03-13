import { IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';
import { SignupDto } from 'src/auth/dto/signup.dto';

export class CreateUserDto extends SignupDto {
  @IsNotEmpty()
  role: Role;
}
