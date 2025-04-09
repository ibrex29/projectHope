import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Orphan } from '@prisma/client';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { CreateOrphanDto } from '../dto/create-orphan.dto';
import { RejectOrphanDto } from '../dto/reject-orphan.dto';
import { UpdateOrphanDto } from '../dto/update-orphan.dto';
import { OrphanService } from '../orphan.service';

@ApiTags('orphan')
@ApiBearerAuth()
@Controller({ path: 'orphan', version: '1' })
export class OrphanController {
  constructor(private readonly orphanService: OrphanService) {}

  @Post()
  async createOrphanAccount(
    @Body() dto: CreateOrphanDto,
    @User('userId') userId: string,
  ) {
    return this.orphanService.createOrphanAccount(dto, userId);
  }

  @Put(':orphanId')
  async updateOrphanAccount(
    @Param('orphanId', ParseUUIDPipe) orphanId: string,
    @Body() updateOrphanDto: UpdateOrphanDto,
    @User('userId') userId: string,
  ) {
    return this.orphanService.updateOrphanAccount(
      orphanId,
      updateOrphanDto,
      userId,
    );
  }

  @Post(':id/submit')
  async submit(@Param('id') orphanId: string) {
    return this.orphanService.submitOrphan(orphanId);
  }

  @Post(':id/approve')
  async acceptOrphan(
    @Param('id') orphanId: string,
    @User('userId') userId: string,
  ): Promise<Orphan> {
    return this.orphanService.approveOrphan(orphanId, userId);
  }

  @Post(':id/reject')
  async rejectOrphan(
    @Param('id') orphanId: string,
    @User('userId') userId: string,
    @Body() dto: RejectOrphanDto,
  ): Promise<Orphan> {
    return this.orphanService.rejectOrphan(orphanId, userId, dto.reason);
  }

  @Get('mine')
  async getOrphansByCreator(@User('userId') userId: string) {
    return this.orphanService.getMyOrphans(userId);
  }

  @Get()
  async getAllOrphans() {
    return this.orphanService.getAllOrphans();
  }

  // @Get('all-deletion-requests')
  // async getOrphansWithDeletionRequests() {
  //   return this.orphanService.getOrphansWithDeletionRequests();
  // }

  // @Get('orhpan-stats-for-guardian')
  // async getOrphanStatsForGuardian(@User('userId') userId: string) {
  //   return this.orphanService.getOrphanStatsForGuardian(userId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete('deletion-request')
  // async orphanDeletionRequest(@Body() dto: OrphanRemovalDto, @User('userId') userId: string): Promise<Orphan> {
  //   return this.orphanService.orphanDeletionRequest(dto, userId);
  // }

  @Delete(':id/delete')
  async deleteOrphan(
    @Param('id') orphanId: string,
    @User('userId') userId: string,
  ): Promise<Orphan> {
    return this.orphanService.deleteOrphan(orphanId);
  }

  // @Get('orphans-stats')
  // async getAllOrphansStats() {
  //   return this.orphanService.getAllOrphansStats();
  // }
}
