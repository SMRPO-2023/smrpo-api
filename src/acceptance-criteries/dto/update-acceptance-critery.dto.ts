import { PartialType } from '@nestjs/swagger';
import { CreateAcceptanceCriteryDto } from './create-acceptance-critery.dto';

export class UpdateAcceptanceCriteryDto extends PartialType(CreateAcceptanceCriteryDto) {}
