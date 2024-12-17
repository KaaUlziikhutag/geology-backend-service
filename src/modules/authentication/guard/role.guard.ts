import { Role } from '../../../utils/enum-utils.js';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '../interface/request-with-user.interface.js';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return user?.role.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
