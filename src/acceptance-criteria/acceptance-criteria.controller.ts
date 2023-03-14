import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query, Put
} from "@nestjs/common";
import { AcceptanceCriteriaService } from './acceptance-criteria.service';
import { CreateAcceptanceCriteriaDto } from './dto/create-acceptance-criteria.dto';
import { UpdateAcceptanceCriteriaDto } from './dto/update-acceptance-criteria.dto';

@Controller('acceptance-criteria')
export class AcceptanceCriteriaController {
  constructor(
    private readonly acceptanceCriteriaService: AcceptanceCriteriaService
  ) {}

  @Post()
  async create(@Body() data: CreateAcceptanceCriteriaDto) {
    return this.acceptanceCriteriaService.create(data);
  }

  @Get()
  async findAll(@Query('usid') userStoryId: number) {
    return this.acceptanceCriteriaService.findAll(+userStoryId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.acceptanceCriteriaService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAcceptanceCriteriaDto
  ) {
    return this.acceptanceCriteriaService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.acceptanceCriteriaService.remove(+id);
  }
}
