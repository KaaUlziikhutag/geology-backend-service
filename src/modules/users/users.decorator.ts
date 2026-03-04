import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type RequestWithUser from '@modules/authentication/interface/request-with-user.interface';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request;
  },
);
