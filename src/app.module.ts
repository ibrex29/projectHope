import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { join } from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheConfigModule } from './cache.module';
import {
  HTTP_MAX_REDIRECTS,
  HTTP_TIMEOUT,
  THROTTLE_LIMIT,
  THROTTLE_TTL,
} from './common/constants';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuardianModule } from './modules/guardian/guardian.module';
import { OrphanModule } from './modules/orphan/orphan.module';
import { SponsorModule } from './modules/sponsor/sponsor.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './upload/upload.module';

console.log('Serving static files from:', join(__dirname, '..', 'uploads'));
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
    OrphanModule,
    GuardianModule,
    SponsorModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
