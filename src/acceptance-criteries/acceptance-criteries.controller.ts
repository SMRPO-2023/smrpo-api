import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcceptanceCriteriesService } from './acceptance-criteries.service';
import { CreateAcceptanceCriteryDto } from './dto/create-acceptance-critery.dto';
import { UpdateAcceptanceCriteryDto } from './dto/update-acceptance-critery.dto';

@Controller('acceptance-criteries')
export class AcceptanceCriteriesController {
  constructor(private readonly acceptanceCriteriesService: AcceptanceCriteriesService) {}

  @Post()
  create(@Body() createAcceptanceCriteryDto: CreateAcceptanceCriteryDto) {
    return this.acceptanceCriteriesService.create(createAcceptanceCriteryDto);
  }

  @Get()
  findAll() {
    return this.acceptanceCriteriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acceptanceCriteriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcceptanceCriteryDto: UpdateAcceptanceCriteryDto) {
    return this.acceptanceCriteriesService.update(+id, updateAcceptanceCriteryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acceptanceCriteriesService.remove(+id);
  }
}
