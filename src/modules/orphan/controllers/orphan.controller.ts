import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  ParseUUIDPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Orphan,  } from '@prisma/client';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { CreateOrphanDto } from '../dto/create-orphan.dto';
import { OrphanRemovalDto } from '../dto/orphan-request-removal.dto';
import { OrphanService } from '../orphan.service';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { Public } from 'src/common/constants/routes.constant';
import { UpdateOrphanDto } from '../dto/update-orphan.dto';

@ApiTags('orphan')
@ApiBearerAuth()
@Controller({ path: 'orphan', version: '1' })
export class OrphanController {
  constructor(private readonly orphanService: OrphanService) {}

  @Post()
  async createOrphanAccount(@Body() dto: CreateOrphanDto,  @User('userId') userId: string) {
    return this.orphanService.createOrphanAccount(dto, userId);
  }

  @Put(':orphanId')
  async updateOrphanAccount(
    @Param('orphanId', ParseUUIDPipe) orphanId: string, 
    @Body() updateOrphanDto: UpdateOrphanDto,
    @User('userId') userId: string, 
  ) {
    return this.orphanService.updateOrphanAccount(orphanId, updateOrphanDto, userId);
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

  @Get('all-deletion-requests')
  async getOrphansWithDeletionRequests() {
    return this.orphanService.getOrphansWithDeletionRequests();
  }
  
  @Get('orhpan-stats-for-guardian')
  async getOrphanStatsForGuardian(@User('userId') userId: string) {
    return this.orphanService.getOrphanStatsForGuardian(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deletion-request')
  async orphanDeletionRequest(@Body() dto: OrphanRemovalDto, @User('userId') userId: string): Promise<Orphan> {
    return this.orphanService.orphanDeletionRequest(dto, userId);
  }

  @Post(':id/delete')
  async deleteOrphan(@Param('id') orphanId: string, @User('userId') userId: string): Promise<Orphan> {
    return this.orphanService.deleteOrphan(orphanId, userId);
  }
 
  @Get('orphans-stats')
  async getAllOrphansStats() {
    return this.orphanService.getAllOrphansStats();
  }

}