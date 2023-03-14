import { PartialType } from '@nestjs/swagger';
import { CreateAcceptanceCriteriaDto } from './create-acceptance-criteria.dto';

export class UpdateAcceptanceCriteriaDto extends PartialType(
  CreateAcceptanceCriteriaDto
) {}
