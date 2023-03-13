import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupDto } from './dto/signup.dto';
import { Token } from './models/token.model';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async createUser(payload: SignupDto): Promise<Token> {
    this.logger.debug(`Creating user ${payload.email}.`);
    try {
      const user = await this.usersService.createUser({
        ...payload,
      });
      this.logger.log(`User ${payload.email} created successfully.`);

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const message = `User already exists.`;
        this.logger.warn(message);
        throw new ConflictException(message);
      }
      this.logger.warn(`Creating user failed with an error ${e}`);
      throw new Error(e);
    }
  }

  async login(email: string, password: string): Promise<Token> {
    this.logger.debug(`User ${email} login.`);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const message = `No user found for email: ${email}.`;
      this.logger.debug(message);
      throw new NotFoundException(message);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      const message = `Invalid password for user ${email}.`;
      this.logger.warn(message);
      throw new BadRequestException(message);
    }

    this.logger.log(`User ${email} login successful.`);

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: number): Promise<User> {
    this.logger.debug(`Validating user ${userId}.`);
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    this.logger.debug(`Getting user from token ${token}.`);
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: number }): Token {
    this.logger.log(`Generating tokens for user ${payload.userId}.`);
    return {
      userId: payload.userId,
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    this.logger.debug(`Generating access token for user ${payload.userId}.`);
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    this.logger.debug(`Generating refresh token for user ${payload.userId}.`);
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    this.logger.debug(`Generating access token from a refresh token ${token}.`);
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      this.logger.error(
        `Failed to generate access token from a refresh token with an error ${e}.`
      );
      throw new UnauthorizedException();
    }
  }
}
