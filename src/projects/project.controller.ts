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
@Controller('project')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects() {
    return this.projectService.findAll();
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

  @Roles('ADMIN')
  @Put(':id')
  updateProject(
    @Body() data: ProjectDto,
    @Param('id', ParseIntPipe) project_id: number
  ) {
    return this.projectService.update({
      data,
      where: { id: project_id },
    });
  }

  @Roles('ADMIN')
  @Delete(':id')
  markDeleted(@Param('id', ParseIntPipe) project_id: number) {
    return this.projectService.markDeleted({ id: project_id });
  }
}
