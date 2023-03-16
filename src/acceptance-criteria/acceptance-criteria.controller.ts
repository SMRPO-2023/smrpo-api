import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AcceptanceCriteriaService } from './acceptance-criteria.service';
import { AcceptanceCriteriaDto } from './dto/acceptance-criteria.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.service';
import { User } from '@prisma/client';
import { UserEntity } from 'src/common/decorators/user.decorator';

@Controller('acceptance-criteria')
@ApiTags('User stories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AcceptanceCriteriaController {
  constructor(
    private readonly acceptanceCriteriaService: AcceptanceCriteriaService
  ) {}

  @Post()
  async create(@Body() data: AcceptanceCriteriaDto, @UserEntity() user: User) {
    return this.acceptanceCriteriaService.create(data, user.id);
  }

  @Get()
  async findAll() {
    return this.acceptanceCriteriaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.acceptanceCriteriaService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UserEntity() user: User,
    @Body() data: AcceptanceCriteriaDto
  ) {
    return this.acceptanceCriteriaService.update(+id, data, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserEntity() user: User
  ) {
    return this.acceptanceCriteriaService.remove(+id, user.id);
  }
}
