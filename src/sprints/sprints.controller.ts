import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintDto } from './dto/sprint.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';

@Controller('sprints')
@ApiTags('Sprints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  create(@Body() createSprintDto: SprintDto, @UserEntity() user: User) {
    return this.sprintsService.create(createSprintDto, user.id);
  }

  @Get('active-sprint')
  @ApiQuery({ name: 'project-id', required: true, type: Number })
  findUnrealizedWithSprint(@Query('project-id') projectId: number) {
    return this.sprintsService.getActiveSprint(projectId);
  }

  @Get()
  findAll() {
    return this.sprintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSprintDto: SprintDto,
    @UserEntity() user: User
  ) {
    return this.sprintsService.update(+id, updateSprintDto, user.id);
  }

  @Delete(':id')
  markDeleted(@Param('id', ParseIntPipe) id: number, @UserEntity() user: User) {
    return this.sprintsService.markDeleted(+id, user.id);
  }
}
