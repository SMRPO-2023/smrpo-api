import { Module } from '@nestjs/common';
import { ProjectDevelopersService } from './project-developers.service';
import { ProjectDevelopersController } from './project-developers.controller';

@Module({
  controllers: [ProjectDevelopersController],
  providers: [ProjectDevelopersService],
})
export class ProjectDevelopersModule {}
