import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put, Req,
  UseGuards
} from "@nestjs/common";
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard.service';
import { ProjectDto } from './dto/project.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { IRequest } from '../common/middleware/user.middleware';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProjects(@Req() req: IRequest) {
    console.log(req?.user);
    return this.projectService.getProjects();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProject(@Param('id', ParseIntPipe) project_id: number) {
    return this.projectService.getProject({ id: project_id });
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
  updateProject(
    @Body() data: ProjectDto,
    @Param('id', ParseIntPipe) project_id: number
  ) {
    return this.projectService.updateProject({
      data,
      where: { id: project_id },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  markDeleted(@Param('id', ParseIntPipe) project_id: number) {
    return this.projectService.markDeleted({ id: project_id });
  }
}
