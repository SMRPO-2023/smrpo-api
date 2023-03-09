import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

/**
 * Returns a middleware which creates a context.
 */
@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async use(req, res, next) {
    let user = null;
    try {
      if (req?.headers?.authorization) {
        const payload: any = this.jwtService.decode(
          req?.headers?.authorization.split(' ')[1]
        );
        user = await this.usersService.getUser({ id: payload?.userId });
      }
    } catch (err) {
      console.log(err);
    }

    req.user = user;
    next();
  }
}
