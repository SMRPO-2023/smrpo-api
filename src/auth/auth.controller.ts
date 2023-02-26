import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Body, Controller, Get, Post, Param } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  async signup(@Body() signupInput: SignupDto) {
    signupInput.email = signupInput.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(
      signupInput
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    const { accessToken, refreshToken } = await this.auth.login(
      email.toLowerCase(),
      password
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  async refreshToken(@Body() { token }: RefreshTokenDto) {
    return this.auth.refreshToken(token);
  }

  @Get('user/:token')
  async user(@Param('token') token: string) {
    return await this.auth.getUserFromToken(token);
  }
}
