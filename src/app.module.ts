import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import config from './common/configs/config';
import { loggingMiddleware } from './common/middleware/logging.middleware';
import { AcceptanceCriteriesModule } from './acceptance-criteries/acceptance-criteries.module';
import { PostsModule } from './posts/posts.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { ProjectsModule } from './projects/projects.module';
import { SprintsModule } from './sprints/sprints.module';
import { StoryCommentsModule } from './story-comments/story-comments.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeLogsModule } from './time-logs/time-logs.module';
import { UserStoriesModule } from './user-stories/user-stories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
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
export class AppModule {}
