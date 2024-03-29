import { PrismaService } from 'nestjs-prisma';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  @Get('me')
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Get()
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, role: true },
      where: { deletedAt: null },
    });
  }

  @Put()
  async updateUser(
    @UserEntity() user: User,
    @Body() newUserData: UpdateUserDto
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @Post('change-password')
  async changePassword(
    @UserEntity() user: User,
    @Body() changePassword: ChangePasswordDto
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }
}
