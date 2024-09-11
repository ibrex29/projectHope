import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule], // No need to call ConfigModule.forRoot again
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isActive = ['true', '1', 'yes'].includes(
          configService.get<string>('API_REDIS_STORE_IS_ACTIVE'),
        );
        return {
          store:
            isActive &&
            (await redisStore({
              // Store-specific configuration:
              socket: {
                // increases the delay between reconnection attempts exponentially
                // up to a maximum of 2000 milliseconds (2 seconds) per attempt.
                reconnectStrategy: (times) => {
                  return Math.min(times * 50, 2000);
                },
                host: configService.get<string>('API_REDIS_HOST'),
                port: +configService.get<number>('API_REDIS_PORT'),
                passphrase: configService.get<string>('API_REDIS_PASS'),
              },
            })), // use redis when available or default to cache store
          ttl: 5000, // milliseconds
          max: 10, // maximum number of items in cache
        } as CacheModuleAsyncOptions;
      },
    }),
  ],
})
export class CacheConfigModule {}
