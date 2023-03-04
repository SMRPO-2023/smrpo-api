import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserEntity = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
  
    return user;
  }
);
