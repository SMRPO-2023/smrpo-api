import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { ProjectDto } from './dto/project.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserEntity } from 'src/common/decorators/user.decorator';
@Controller('project')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects(@UserEntity() user: User) {
    return this.projectService.findAll(user);
  }

  @Get(':id')
  getProject(@Param('id', ParseIntPipe) project_id: number) {
    return this.projectService.findOne({ id: project_id });
  }

  @Roles('ADMIN')
  @Post()
  createProject(@Body() data: ProjectDto) {
    return this.projectService.create(data);
  }

  @Put(':id')
  updateProject(
    @Body() data: ProjectDto,
    @UserEntity() user: User,
    @Param('id', ParseIntPipe) projectId: number
  ) {
    return this.projectService.update(data, projectId, user);
  }

  @Delete('delete-documentation/:id')
  deleteProjectDocumentation(
    @UserEntity() user: User,
    @Param('id', ParseIntPipe) projectId: number
  ) {
    return this.projectService.removeDocumentation(projectId, user);
  }

  @Roles('ADMIN')
  @Delete(':id')
  markDeleted(@Param('id', ParseIntPipe) project_id: number) {
    return this.projectService.markDeleted({ id: project_id });
  }
}
