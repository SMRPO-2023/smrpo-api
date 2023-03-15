import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { CreateProjectMembersDto } from './dto/create-project-members.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('project-members')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Get()
  @ApiQuery({ name: 'project id', required: false, type: Number })
  async findAll(@Query('project id') pid?: number) {
    return this.projectMembersService.findAll(Number(pid));
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: CreateProjectMemberDto) {
    return this.projectMembersService.create(data);
  }

  @Post('multi')
  @Roles('ADMIN')
  async createMulti(@Body() data: CreateProjectMembersDto) {
    return this.projectMembersService.createMulti(data);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectMemberDto
  ) {
    return this.projectMembersService.update({ id }, data);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectMembersService.remove({ id });
  }
}
