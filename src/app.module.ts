import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { ContextMiddleware } from './middlewares/context.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from './config/env';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RequestLog, RequestLogSchema } from './modules/request-log/request-log.schema';
import { RequestLogMiddleware } from './middlewares/request-log.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGO_URI),
    MongooseModule.forFeature([{ name: RequestLog.name, schema: RequestLogSchema }]),
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(RequestLogMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
