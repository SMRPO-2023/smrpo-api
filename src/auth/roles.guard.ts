import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug(`Finding roles.`);
    const roles: Role[] = this.reflector.get<Role[]>(
      'roles',
      context.getHandler()
    );
    this.logger.debug(`Found roles ${roles}.`);
    if (!roles) {
      this.logger.error(`No roles found.`);
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.logger.debug(`User role is  ${user.role}.`);
    return roles.includes(user.role);
  }
}
