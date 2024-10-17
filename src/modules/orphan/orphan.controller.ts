import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UnauthorizedException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrphanService } from './orphan.service';
import { CreateOrphanDto } from './dto/create-orphan.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Orphan, User } from '@prisma/client';
import { CreateRequestDto } from './dto/create-request.dto';
import { Request as PrismaRequest } from '@prisma/client';
import { OrphanFilterDto } from './dto/fetch-orphan.dto';
import { Public } from 'src/common/constants/routes.constant';
import { RequestRemovalDto } from './dto/request-removal.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OrphanRemovalDto } from './dto/orphan-request-removal.dto';

@ApiTags('orphan')
@ApiBearerAuth()
// @Public()
@Controller({ path: 'orphan', version: '1' })
export class OrphanController {
  constructor(private readonly orphanService: OrphanService) {}

  @Post()
  async createOrphanAccount(@Body() dto: CreateOrphanDto, @Request() req) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User ID is required');
    return this.orphanService.createOrphanAccount(dto, userId);
  }

  @Post(':id/accept')
  async acceptOrphan(@Param('id') orphanId: string, @Request() req): Promise<Orphan> {
    return this.orphanService.acceptOrphan(orphanId, req.user?.userId);
  }

  @Get()
  async getAllOrphans(): Promise<User[]> {
    return this.orphanService.getAllOrphans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('deletion-request')
  async orphanDeletionRequest(@Body() dto: OrphanRemovalDto, @Request() req): Promise<Orphan> {
    const userId = req.user?.userId;

    // Pass the dto and userId to the orphanDeletionRequest service method
    return this.orphanService.orphanDeletionRequest(dto, userId);
  }

  @Post(':id/delete')
  async deleteOrphan(@Param('id') orphanId: string, @Request() req): Promise<Orphan> {
    const userId = req.user?.userId;
    return this.orphanService.deleteOrphan(orphanId, userId);
  }

}
  @ApiTags('Request')
  @Controller({ path: 'request', version: '1' })
export class RequestController {
  constructor(private readonly orphanService: OrphanService) {}


  @Post()
  async createRequest(@Body() createRequestDto: CreateRequestDto, @Request() req) {
    const userId = req.user?.userId;
    return this.orphanService.createNeedRequest(createRequestDto,userId);
  }
  @Public()
  @Get('all-request')
  async getAllRequests() {
    return this.orphanService.listAllRequests();
  }

  @UseGuards(JwtAuthGuard)
  @Post('deletion-request')
  async removeRequest(@Body() dto: RequestRemovalDto, @Request() req): Promise<PrismaRequest> {
  const userId = req.user?.userId;
  return  this.orphanService.needRequestRemoval(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/delete')
  async deleteNeedRequest(@Param('id') requestId: string, @Request() req){
    const userId = req.user?.userId;
    return this.orphanService.deleteNeedRequest(requestId, userId);
  }


}
