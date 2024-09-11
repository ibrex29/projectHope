// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { RedisModule } from '@nestjs-modules/ioredis';

// @Module({
//   imports: [
//     RedisModule.forRootAsync({
//       imports: [ConfigModule], // No need to call ConfigModule.forRoot again
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => {
//         const redisHost = configService.getOrThrow<string>('REDIS_HOST');
//         const redisPort = +configService.getOrThrow<number>('REDIS_PORT');
//         const redisPass = configService.getOrThrow<string>('REDIS_PASS');
//         const redisSSL = configService.get<boolean>('REDIS_SSL') || false;

//         const config = {
//           password: redisPass,
//           host: redisHost,
//           port: redisPort,
//         };

//         if (redisSSL) {
//           // If REDIS_SSL is true, enable SSL/TLS
//           config['tls'] = {
//             host: redisHost,
//             port: redisPort,
//           };
//         }

//         return { config };
//       },
//     }),
//   ],
// })
// export class RedisConfigModule {}
