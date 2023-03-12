import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { PasswordService } from 'src/auth/password.service';
import { RolesGuard } from 'src/auth/roles-guard.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admin/users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersAdminController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  @Get()
  async getAllUsers(): Promise<Array<User>> {
    return this.prisma.user.findMany();
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  @Put(':id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role
  ): Promise<User> {
    return await this.prisma.user.update({
      data: { role },
      where: { id },
    });
  }

  @Post()
  async createUser(@Body() newUserData: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(newUserData);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto
  ): Promise<User> {
    if (!dto.password) {
      delete dto.password;
    } else {
      dto.password = await this.passwordService.hashPassword(dto.password);
    }
    return await this.prisma.user.update({
      data: { ...dto },
      where: { id },
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
