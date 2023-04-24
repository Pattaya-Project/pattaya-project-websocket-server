import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const StringToObject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToWs()
    return typeof(request.getData()) == 'string' ? JSON.parse(request.getData()): request.getData() ;
  },
);