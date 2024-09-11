// import { InjectRedis } from '@nestjs-modules/ioredis';
// import { Injectable } from '@nestjs/common';
// import { Redis } from 'ioredis';

// @Injectable()
// export class RedisService {
//   constructor(@InjectRedis() private redis: Redis) {}

//   async hset(key: string, data: any): Promise<void> {
//     await this.redis.hset(key, data);
//   }

//   async hgetall(key: string): Promise<any> {
//     return this.redis.hgetall(key);
//   }

//   // SETS
//   async zadd(key: string, score: number, member: string): Promise<void> {
//     await this.redis.zadd(key, score, member);
//   }

//   async zrangebyscore(
//     key: string,
//     min: number,
//     max: number,
//   ): Promise<string[]> {
//     return this.redis.zrangebyscore(key, min, max);
//   }

//   async set(key: string, value: any, expiry?: number): Promise<void> {
//     await this.redis.set(key, value);
//     if (expiry) {
//       await this.redis.expire(key, expiry);
//     }
//   }

//   async get(key: string): Promise<any> {
//     return this.redis.get(key);
//   }

//   async del(key: string): Promise<number> {
//     return this.redis.del(key);
//   }
// }
