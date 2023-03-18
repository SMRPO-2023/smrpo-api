import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintDto } from './dto/sprint.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('sprints')
@ApiTags('Sprints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createSprintDto: SprintDto) {
    return this.sprintsService.create(createSprintDto);
  }

  @Get()
  findAll() {
    return this.sprintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSprintDto: SprintDto
  ) {
    return this.sprintsService.update(+id, updateSprintDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.remove(+id);
  }
}
