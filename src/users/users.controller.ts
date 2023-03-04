import { PrismaService } from 'nestjs-prisma';
import { Body, Controller, Get, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/roles-guard.service';
import { Roles } from 'src/common/decorators/roles.decorator';

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

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getAllUsers(): Promise<Array<User>> {
    return this.prisma.user.findMany();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @UserEntity() user: User,
    @Body('data') newUserData: UpdateUserDto
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @UserEntity() user: User,
    @Body('data') changePassword: ChangePasswordDto
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
