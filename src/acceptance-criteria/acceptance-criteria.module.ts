import { Module } from '@nestjs/common';
import { AcceptanceCriteriaService } from './acceptance-criteria.service';
import { AcceptanceCriteriaController } from './acceptance-criteria.controller';

@Module({
  controllers: [AcceptanceCriteriaController],
  providers: [AcceptanceCriteriaService],
})
export class AcceptanceCriteriaModule {}
