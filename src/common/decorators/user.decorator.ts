import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // TODO return current jwt user
    console.log(data, ctx);
    return null;
  }
);
