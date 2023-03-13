import { Injectable } from '@nestjs/common';
import { CreateAcceptanceCriteryDto } from './dto/create-acceptance-critery.dto';
import { UpdateAcceptanceCriteryDto } from './dto/update-acceptance-critery.dto';

@Injectable()
export class AcceptanceCriteriesService {
  create(createAcceptanceCriteryDto: CreateAcceptanceCriteryDto) {
    return 'This action adds a new acceptanceCritery';
  }

  findAll() {
    return `This action returns all acceptanceCriteries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} acceptanceCritery`;
  }

  update(id: number, updateAcceptanceCriteryDto: UpdateAcceptanceCriteryDto) {
    return `This action updates a #${id} acceptanceCritery`;
  }

  remove(id: number) {
    return `This action removes a #${id} acceptanceCritery`;
  }
}
