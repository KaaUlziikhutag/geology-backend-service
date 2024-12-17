import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import RequestWithUser from '../authentication/interface/request-with-user.interface.js';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request;
  },
);
