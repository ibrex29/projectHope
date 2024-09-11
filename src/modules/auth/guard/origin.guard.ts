// src/guards/ip-restriction.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requestOrigin = request.get('origin') || request.get('referer');
    const allowedOrigins = this.configService.get<string[]>('ALLOWED_ORIGINS');

    return allowedOrigins.includes(requestOrigin);
  }
}
