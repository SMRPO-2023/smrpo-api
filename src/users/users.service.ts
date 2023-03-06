import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,

  ) {}

  async createUser(payload: CreateUserDto): Promise<User | never> {
    const hashedPassword = await this.passwordService.hashPassword(payload.password);

    try {
      return await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword
        }
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }
      throw new Error(e);
    }
  }

  updateUser(userId: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      data,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordDto
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
