import { PrismaService } from 'nestjs-prisma';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  @Get('me')
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @UserEntity() user: User,
    @Body('data') newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @UserEntity() user: User,
    @Body('data') changePassword: ChangePasswordInput
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @Get('posts')
  posts(@Body() author: User) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  }
}
