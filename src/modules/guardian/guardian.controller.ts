import { Controller, Get, Post, Put, Body, Param,  Req, Res, Query, UseGuards, Headers, Delete} from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { ApiBearerAuth, ApiResponse, ApiTags,ApiOperation } from '@nestjs/swagger';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { Public, Role } from 'src/common/constants/routes.constant';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { CreateSponsorshipRequestDto, UpdateSponsorshipRequestDto, UpdateSupportingDocumentDto } from './dto/create-sponsorship-request.dto';
import { RejectSponsorshipRequestDto } from '../sponsor/dto/reject-spoonsoorship.dto';
import { FetchSponsorshipRequestDto } from '../sponsor/dto/fetch-requestt.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { UserType } from '../users/types/user.type';
import { PaymentService } from '../sponsor/payment.service';
import { Request, Response } from 'express';
import { InitializePaymentDto } from './dto/initialize-payment.dto';


@ApiBearerAuth()
@ApiTags("guardian")
@Controller({ path: 'guardian', version: '1' })
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Public()
  @Post('')
  createUser(@Body() createGuardianDto: CreateGuardianDto) {
    return this.guardianService.createGuardian(createGuardianDto);
  }

  // @Put(':id')
  // async updateGuardian(@User('userId') userId: string, @Body() updateGuardianDto: UpdateGuardianDto): Promise<User> {
  //   return this.guardianService.updateGuardian(userId, updateGuardianDto);
  // }
  
  @Get()
  async getAllGuardian(){
    return this.guardianService.getAllGuardian();
  }

  @Get('has-orphans')
  async checkGuardianOrphans(@User('userId') userId: string) {
    return await this.guardianService.hasOrphans(userId);
  }

  @Get('top-guardian')
  async getGuardianSummary() {
    return await this.guardianService.getTopGuardian();  
  }


}
@UseGuards(RolesGuard)
@Role(UserType.GUARDIAN)
@ApiBearerAuth()
@ApiTags('Sponsorship Requests')
@Controller('sponsorship-requests')
export class SponsorshipController {
  constructor(
    private readonly guardianService: GuardianService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('request')
  @ApiOperation({ summary: 'Create a new sponsorship request' })
  create(@Body() dto: CreateSponsorshipRequestDto, @User('userId') userId: string) {
    return this.guardianService.create(dto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sponsorship request' })
  async updateSponsorshipRequest(
    @Param('id') id: string,
    @Body() dto: UpdateSponsorshipRequestDto
  ) {
    return this.guardianService.updateRequest(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete draft requests' })
  async deleteDraftRequest(@Param('id') id:string){
    return this.guardianService.deleteDraftRequest(id);
  }
  

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a sponsorship request' })
  async approveSponsorship(@Param('id') id: string, @User('userId') userId: string) {
    return this.guardianService.approveSponsorshipRequest(id, userId);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Approve a sponsorship request' })
  async publishSponsorship(@Param('id') id: string, @User('userId') userId: string) {
    return this.guardianService.publishSponsorshipRequest(id, userId);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close a sponsorship request' }) 
  async closeSponsorship(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() dto: RejectSponsorshipRequestDto
  
  ) {
    return this.guardianService.closeSponsorshipRequest(id, userId,dto.Reason);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a sponsorship request with a reason' })
  async rejectSponsorship(
    @Param('id') id: string, 
    @User('userId') userId: string, 
    @Body() dto: RejectSponsorshipRequestDto
  ) {
    return this.guardianService.rejectSponsorshipRequest(id, userId, dto.Reason);
  }

  @Put(':id/attachments')
  async update(@Param('id') id: string, @Body() updateData: UpdateSupportingDocumentDto) {
    return this.guardianService.updateSupportingDocument(id, updateData);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all sponsorship requests with pagination, search, and filters' })
  async getAll(@Query() dto: FetchSponsorshipRequestDto) {
    return this.guardianService.getAllSponsorshipRequests(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a sponsorship request by ID' })
  async getById(@Param('id') id: string) {
    return this.guardianService.getSponsorshipRequestById(id);
  }

}