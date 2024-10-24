import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Orphan,  } from '@prisma/client';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { CreateOrphanDto } from '../dto/create-orphan.dto';
import { OrphanRemovalDto } from '../dto/orphan-request-removal.dto';
import { OrphanService } from '../orphan.service';
import { User } from 'src/common/decorators/param-decorator/User.decorator';

@ApiTags('orphan')
@ApiBearerAuth()
@Controller({ path: 'orphan', version: '1' })
export class OrphanController {
  constructor(private readonly orphanService: OrphanService) {}

  @Post()
  async createOrphanAccount(@Body() dto: CreateOrphanDto,  @User('userId') userId: string) {
    return this.orphanService.createOrphanAccount(dto, userId);
  }

  @Post(':id/accept')
  async acceptOrphan(@Param('id') orphanId: string, @User('userId') userId: string): Promise<Orphan> {
    return this.orphanService.acceptOrphan(orphanId, userId);
  }

  @Get('mine')
  async getOrphansByCreator( @User('userId') userId: string) {
    return this.orphanService.getMyOrphans(userId);
  }

  @Get()
  async getAllOrphans() {
    return this.orphanService.getAllOrphans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('deletion-request')
  async orphanDeletionRequest(@Body() dto: OrphanRemovalDto, @User('userId') userId: string): Promise<Orphan> {
    return this.orphanService.orphanDeletionRequest(dto, userId);
  }

  @Post(':id/delete')
  async deleteOrphan(@Param('id') orphanId: string, @User('userId') userId: string): Promise<Orphan> {
    return this.orphanService.deleteOrphan(orphanId, userId);
  }

}