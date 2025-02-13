import { Module } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { GuardianController, SponsorshipController } from './guardian.controller';

@Module({
  controllers: [GuardianController,SponsorshipController],
  providers: [GuardianService],
})
export class GuardianModule {}
