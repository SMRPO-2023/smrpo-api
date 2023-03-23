import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import config from './common/configs/config';
import { ProjectModule } from './projects/project.module';
import { PostsModule } from './posts/posts.module';
import { SprintsModule } from './sprints/sprints.module';
import { StoryCommentsModule } from './story-comments/story-comments.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeLogsModule } from './time-logs/time-logs.module';
import { UserStoriesModule } from './user-stories/user-stories.module';
import { UserMiddleware } from './common/middleware/user.middleware';
import { PrismaLoggingMiddleware } from './common/middleware/prisma.logging.middleware';
import { ExpressLoggerMiddleware } from './common/middleware/express.logging.middleware';
import { UsersService } from './users/users.service';
import { PasswordService } from './auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { ProjectDevelopersModule } from './project-developers/project-developers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: { log: ['query', 'info', 'warn', 'error'] },
        middlewares: [PrismaLoggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),
    AuthModule,
    UsersModule,
    ProjectModule,
    PostsModule,
    ProjectDevelopersModule,
    SprintsModule,
    StoryCommentsModule,
    TasksModule,
    TimeLogsModule,
    UserStoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, PasswordService, JwtService], // Those are required for middleware
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExpressLoggerMiddleware).forRoutes('*');
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
