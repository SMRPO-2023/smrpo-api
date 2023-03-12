import { AuthService } from './auth.service';
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

    return await this.auth.createUser(signupInput);
  }

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    return await this.auth.login(email.toLowerCase(), password);
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
