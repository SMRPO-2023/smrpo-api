import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Role, User } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard.service";
import { RolesGuard } from "src/auth/roles-guard.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersAdminController {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getAllUsers(): Promise<Array<User>> {
    return this.prisma.user.findMany();
  }

  @Put(':id/role')
  async updateUserRole(@Param('id') id, @Body('role') role: Role): Promise<User> {
    return await this.prisma.user.update({
        data: {role}, 
        where: {id}
    });
  }

  @Post()
  async createUser(@Body() newUserData: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(newUserData);
  }
}