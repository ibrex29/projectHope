import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from './password.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { JwtTokenService } from 'src/common/token/jwt-token.service';
import { LoginValidationMiddleware } from 'src/common/middlewares/login-validation.middleware';
import { UsersModule } from '../users/users.module';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { PrismaService } from 'prisma/prisma.service';


@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtTokenService,
    PasswordService,
    PrismaService,
    {
      provide: APP_GUARD, // set api rate limiting globally (throttling)
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD, // set authentication globally
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes({
      path: 'v1/auth/login/email',
      method: RequestMethod.POST,
    });
  }
}
