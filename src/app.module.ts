import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import config from './common/configs/config';

import { AcceptanceCriteriesModule } from './acceptance-criteries/acceptance-criteries.module';
import { PostsModule } from './posts/posts.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { ProjectsModule } from './projects/projects.module';
import { SprintsModule } from './sprints/sprints.module';
import { StoryCommentsModule } from './story-comments/story-comments.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeLogsModule } from './time-logs/time-logs.module';
import { UserStoriesModule } from './user-stories/user-stories.module';
import { PrismaLoggingMiddleware } from './common/middleware/prisma.logging.middleware';
import { ExpressLoggerMiddleware } from './common/middleware/express.logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [PrismaLoggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),
    AuthModule,
    UsersModule,
    AcceptanceCriteriesModule,
    PostsModule,
    ProjectMembersModule,
    ProjectsModule,
    SprintsModule,
    StoryCommentsModule,
    TasksModule,
    TimeLogsModule,
    UserStoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ExpressLoggerMiddleware).forRoutes('*');
  }
}
