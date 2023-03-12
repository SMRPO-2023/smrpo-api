import { Module } from '@nestjs/common';
import { UserStoriesService } from './user-stories.service';
import { UserStoriesController } from './user-stories.controller';

@Module({
  controllers: [UserStoriesController],
  providers: [UserStoriesService]
})
export class UserStoriesModule {}
