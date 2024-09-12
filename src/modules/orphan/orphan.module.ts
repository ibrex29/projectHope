import { Module } from '@nestjs/common';
import { OrphanService } from './orphan.service';
import { OrphanController } from './orphan.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [OrphanController],
  providers: [OrphanService,PrismaService],
})
export class OrphanModule {}
