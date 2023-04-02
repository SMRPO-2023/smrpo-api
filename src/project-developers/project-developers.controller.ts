import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectDevelopersService } from './project-developers.service';
import { ProjectDeveloperDto } from './dto/project-developer.dto';
import { ProjectDevelopersDto } from './dto/project-developers.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('project-developers')
@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectDevelopersController {
  constructor(
    private readonly projectMembersService: ProjectDevelopersService
  ) {}

  @Get()
  @ApiQuery({ name: 'project-id', type: Number })
  async findAll(@Query('project-id') pid: number, @UserEntity() user: User) {
    return this.projectMembersService.findAll(Number(pid), user);
  }

  @Post()
  async create(@Body() data: ProjectDeveloperDto, @UserEntity() user: User) {
    return this.projectMembersService.create(data, user);
  }

  @Post('multi')
  async createMulti(
    @Body() data: ProjectDevelopersDto,
    @UserEntity() user: User
  ) {
    return this.projectMembersService.createMulti(data, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserEntity() user: User
  ) {
    return this.projectMembersService.remove(id, user);
  }
}
