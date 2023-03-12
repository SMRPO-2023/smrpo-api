import { Module } from '@nestjs/common';
import { AcceptanceCriteriesService } from './acceptance-criteries.service';
import { AcceptanceCriteriesController } from './acceptance-criteries.controller';

@Module({
  controllers: [AcceptanceCriteriesController],
  providers: [AcceptanceCriteriesService]
})
export class AcceptanceCriteriesModule {}
