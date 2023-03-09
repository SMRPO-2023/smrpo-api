import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { ProjectDto } from './dto/project.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProjects() {
    return this.projectService.getProjects();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProject(@Param('id') project_id: string) {
    return this.projectService.getProject(project_id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post()
  createProject(@Body() data: ProjectDto) {
    return this.projectService.createProject(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Put('id')
  updateProject(@Body() data: ProjectDto, @Param('id') project_id: string) {
    return this.projectService.updateProject({
      data,
      where: { id: project_id },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete('id')
  markDeleted(@Param('id') project_id: string) {
    return this.projectService.markDeleted({ id: project_id });
  }
}
