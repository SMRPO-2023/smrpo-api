import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordService } from 'src/auth/password.service';
import { UsersAdminController } from './users.admin.controller';

@Module({
  imports: [],
  providers: [UsersService, PasswordService],
  controllers: [UsersController, UsersAdminController],
})
export class UsersModule {}
