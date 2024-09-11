import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyAuthGuard } from './apikey-auth.guard';
import { IS_PUBLIC_KEY } from 'src/common/constants';
@Injectable()
export class AnyAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly guards: JwtAuthGuard[] | ApiKeyAuthGuard[],
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();

    for (const guard of this.guards) {
      if (guard instanceof AuthGuard) {
        // Attempt to use the current guard to authenticate
        const result = await guard.canActivate(context);

        // If authentication succeeds, set the authType and return true
        if (result) {
          request.authType = guard.getStrategy();
          return true;
        }
      }
    }

    // Neither API key nor JWT token is present or authentication failed for all guards.
    return false;
  }
}
