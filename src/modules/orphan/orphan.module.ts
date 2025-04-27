import { Module } from '@nestjs/common';
import { OrphanService } from './orphan.service';
import { PrismaService } from 'prisma/prisma.service';
import { OrphanController } from './controllers/orphan.controller';
import {
  NeedController,
  RequestController,
} from './controllers/request.controller';
import { RequestService } from './request.service';

@Module({
  controllers: [OrphanController, RequestController, NeedController],
  providers: [OrphanService, PrismaService, RequestService],
})
export class OrphanModule {}
