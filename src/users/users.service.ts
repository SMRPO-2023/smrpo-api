import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  async getUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  async createUser(payload: CreateUserDto): Promise<User | never> {
    this.logger.debug(`Creating user ${payload.email}.`);
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      return await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const message = `Email ${payload.email} already used.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
      this.logger.warn(
        `Creating user ${payload.email} failed with an error ${e}`
      );
      throw new Error(e);
    }
  }

  updateUser(userId: number, data: UpdateUserDto) {
    this.logger.debug(`Updating user ${userId}.`);
    return this.prisma.user.update({
      data,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(
    userId: number,
    userPassword: string,
    changePassword: ChangePasswordDto
  ) {
    this.logger.debug(`Changing user ${userId} password.`);
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      const message = `User ${userId}'s password is invalid.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    this.logger.debug(`User ${userId} password is valid.`);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
