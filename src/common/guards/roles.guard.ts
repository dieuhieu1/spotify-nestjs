import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode } from '../enums/error-code.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new AppException(ErrorCode.UNAUTHENTICATED);

    const scope: string[] = (user.scope || '').split(' ').filter(Boolean);

    if (requiredRoles) {
      const hasRole = requiredRoles.some((role) => scope.includes(`ROLE_${role}`));
      if (!hasRole) throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    if (requiredPermissions) {
      const hasPerm = requiredPermissions.every((perm) => scope.includes(perm));
      if (!hasPerm) throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    return true;
  }
}
