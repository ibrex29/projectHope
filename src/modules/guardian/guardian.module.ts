import { Module } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { GuardianController } from './guardian.controller';

@Module({
  controllers: [GuardianController],
  providers: [GuardianService],
})
export class GuardianModule {}
