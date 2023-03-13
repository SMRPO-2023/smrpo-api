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
} from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { CreateProjectMembersDto } from './dto/create-project-members.dto';

@Controller('project-members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Get()
  async findAll(@Query('pid', ParseIntPipe) pid: number) {
    return this.projectMembersService.findAll(pid);
  }

  @Post()
  async create(@Body() data: CreateProjectMemberDto) {
    return this.projectMembersService.create(data);
  }

  @Post('multi')
  async createMulti(@Body() data: CreateProjectMembersDto) {
    return this.projectMembersService.createMulti(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectMemberDto
  ) {
    return this.projectMembersService.update({ id }, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectMembersService.remove({ id });
  }
}
