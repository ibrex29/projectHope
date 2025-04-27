import { JwtPayload } from 'src/modules/auth/types';
import {
  BLACKLISTED_TOKEN,
  JWT_ACCESS_EXPIRY,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRY,
  JWT_REFRESH_SECRET,
  MILLISECONDS_PER_SECOND,
} from '../constants';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import ms from 'ms';

@Injectable()
export class JwtTokenService {
  private JWT_ACCESS_SECRET;
  private JWT_ACCESS_EXPIRY;
  private JWT_REFRESH_SECRET;
  private JWT_REFRESH_EXPIRY;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.JWT_ACCESS_SECRET = this.configService.getOrThrow(JWT_ACCESS_SECRET);
    this.JWT_ACCESS_EXPIRY = this.configService.getOrThrow(JWT_ACCESS_EXPIRY);
    this.JWT_REFRESH_SECRET = this.configService.getOrThrow(JWT_REFRESH_SECRET);
    this.JWT_REFRESH_EXPIRY = this.configService.getOrThrow(JWT_REFRESH_EXPIRY);
  }

  async generateToken(payload: Partial<any>): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessTokenPromise = this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: this.JWT_ACCESS_EXPIRY,
    });

    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: this.JWT_REFRESH_EXPIRY,
    });

    return Promise.all([accessTokenPromise, refreshTokenPromise]).then(
      ([accessToken, refreshToken]) => ({ accessToken, refreshToken }),
    );
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.JWT_ACCESS_SECRET,
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.JWT_REFRESH_SECRET,
    });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.cacheManager.get(
      BLACKLISTED_TOKEN + token,
    );
    return !!blacklistedToken;
  }

  private extractExpirationTime(token: string): number | null {
    try {
      const { exp } = this.jwtService.decode(token) as { exp: number };
      return exp; // return jwt exipry in seconds
    } catch (error) {
      return null; // Invalid token or unable to decode
    }
  }

  blacklist(token: string): Promise<void> {
    // get the time when the token is supposed to expire
    const expirationTime = this.extractExpirationTime(token);
    const expirationTimeMs = !!expirationTime
      ? (expirationTime - Math.floor(Date.now() / MILLISECONDS_PER_SECOND)) *
        MILLISECONDS_PER_SECOND
      : ms(this.JWT_ACCESS_EXPIRY);

    return this.cacheManager.set(
      BLACKLISTED_TOKEN + token,
      true,
      +expirationTimeMs, // don't keep tokens forever, delete from cache when the token expires
    );
  }
}
