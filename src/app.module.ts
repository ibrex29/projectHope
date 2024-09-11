import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { CacheConfigModule } from './cache.module';
import { HTTP_MAX_REDIRECTS, HTTP_TIMEOUT, THROTTLE_LIMIT, THROTTLE_TTL } from './common/constants';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { AnalyticsModule } from './modules/analytics/analytics.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, 
      envFilePath: ['docker.env', '.env'],
      isGlobal: true,
    }),
    CacheConfigModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '19000s' },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: seconds(configService.get(THROTTLE_TTL) || 10), 
          limit: configService.get(THROTTLE_LIMIT) || 20, 
        },
      ],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get(HTTP_TIMEOUT),
        maxRedirects: configService.get(HTTP_MAX_REDIRECTS),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
