import { Module } from '@nestjs/common';
import { OrphanService } from './orphan.service';
import { OrphanController, RequestController } from './orphan.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [OrphanController,RequestController],
  providers: [OrphanService,PrismaService],
})
export class OrphanModule {}
