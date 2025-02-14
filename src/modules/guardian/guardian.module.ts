import { Module } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { GuardianController, SponsorshipController } from './guardian.controller';
import { PaymentService } from '../sponsor/payment.service';

@Module({
  controllers: [GuardianController,SponsorshipController],
  providers: [GuardianService,PaymentService],
})
export class GuardianModule {}
