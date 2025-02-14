import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { SponsorController } from './sponsor.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PaymentService } from './payment.service';

@Module({
  controllers: [SponsorController],
  providers: [SponsorService,PrismaService,PaymentService],
})
export class SponsorModule {}
