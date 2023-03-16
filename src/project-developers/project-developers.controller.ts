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
import { CreateProjectDeveloperDto } from './dto/create-project-developer.dto';
import { CreateProjectDevelopersDto } from './dto/create-project-developers.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('project-developers')
@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectDevelopersController {
  constructor(
    private readonly projectMembersService: ProjectDevelopersService
  ) {}

  @Get()
  @ApiQuery({ name: 'project id', required: false, type: Number })
  async findAll(@Query('project id') pid?: number) {
    return this.projectMembersService.findAll(Number(pid));
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: CreateProjectDeveloperDto) {
    return this.projectMembersService.create(data);
  }

  @Post('multi')
  @Roles('ADMIN')
  async createMulti(@Body() data: CreateProjectDevelopersDto) {
    return this.projectMembersService.createMulti(data);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectMembersService.remove({ id });
  }
}
