import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, Role } from 'src/common/constants/routes.constant';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { RejectOrphanDto } from '../orphan/dto/reject-orphan.dto';
import { RejectSponsorshipRequestDto } from '../sponsor/dto/reject-spoonsoorship.dto';
import { PaymentService } from '../sponsor/payment.service';
import { UserType } from '../users/types/user.type';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import {
  CreateSponsorshipRequestDto,
  RequestSponsorshipRequestEditDto,
  UpdateSponsorshipRequestDto,
  UpdateSupportingDocumentDto,
} from './dto/create-sponsorship-request.dto';
import { GuardianService } from './guardian.service';

@ApiBearerAuth()
@ApiTags('guardian')
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
  async getAllGuardian() {
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
@Role(UserType.GUARDIAN, UserType.ADMIN, UserType.SPONSOR)
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
  create(
    @Body() dto: CreateSponsorshipRequestDto,
    @User('userId') userId: string,
  ) {
    return this.guardianService.create(dto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sponsorship request' })
  async updateSponsorshipRequest(
    @Param('id') id: string,
    @Body() dto: UpdateSponsorshipRequestDto,
  ) {
    return this.guardianService.updateRequest(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete draft requests' })
  async deleteDraftRequest(@Param('id') id: string) {
    return this.guardianService.deleteDraftRequest(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a sponsorship request' })
  async approveSponsorship(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.guardianService.approveSponsorshipRequest(id, userId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit a sponsorship request for approval' })
  async submitSponsorship(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.guardianService.submitSponsorshipRequest(id, userId);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a sponsorship request' })
  async publishSponsorship(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.guardianService.publishSponsorshipRequest(id, userId);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close a sponsorship request' })
  async closeSponsorship(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() dto: RejectSponsorshipRequestDto,
  ) {
    return this.guardianService.closeSponsorshipRequest(id, userId, dto.reason);
  }
  1;
  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a sponsorship request with a reason' })
  async rejectSponsorship(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() dto: RejectSponsorshipRequestDto,
  ) {
    return this.guardianService.rejectSponsorshipRequest(
      id,
      userId,
      dto.reason,
    );
  }

  @Put(':id/attachments')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateSupportingDocumentDto,
  ) {
    return this.guardianService.updateSupportingDocument(id, updateData);
  }

  @Delete(':id/attachments/:attachmentId')
  async deleteAttachment(
    @Param('id') sponsorshipRequestId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.guardianService.deleteSupportingDocument(
      sponsorshipRequestId,
      attachmentId,
    );
  }

  @Get()
  async getAll() {
    return this.guardianService.getAllSponsorshipRequests();
  }

  @Get('mine')
  async getAllForUser(@User('userId') userId: string) {
    return this.guardianService.getMySponsorshipRequests(userId);
  }

  @Get('edit-requests')
  @ApiOperation({ summary: 'Get all edit requests for sponsorship requests' })
  async getEditRequests() {
    return this.guardianService.getSponsorshipRequestEditRequests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a sponsorship request by ID' })
  async getById(@Param('id') id: string) {
    return this.guardianService.getSponsorshipRequestById(id);
  }

  @Post(':id/request-edit')
  @ApiOperation({ summary: 'Request an edit for a sponsorship request' })
  async requestEdit(
    @Param('id') id: string,
    @Body() dto: RequestSponsorshipRequestEditDto,
    @User('userId') userId: string,
  ) {
    return this.guardianService.requestSponsorshipRequestEdit(id, dto, userId);
  }

  @Post(':id/approve-edit')
  @ApiOperation({
    summary: 'Approve an edit request for a sponsorship request',
  })
  async approveEdit(@Param('id') id: string) {
    return this.guardianService.approveSponsorshipRequestEdit(id);
  }

  @Post(':id/reject-edit')
  @ApiOperation({ summary: 'Reject an edit request for a sponsorship request' })
  async rejectEdit(
    @Param('id') id: string,
    @Body() dto: RejectOrphanDto,
    @User('userId') userId: string,
  ) {
    return this.guardianService.rejectSponsorshipRequestEdit(
      id,
      userId,
      dto.reason,
    );
  }

  @Post(':id/request-publish')
  @ApiOperation({ summary: 'Request a sponsorship request to be published' })
  async requestPublish(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() dto: RejectSponsorshipRequestDto,
  ) {
    return this.guardianService.requestSponsorshipRequestPublish(
      id,
      userId,
      dto.reason,
    );
  }

  @Get('publish-requests')
  async getPublishRequests() {
    return this.guardianService.getPublishRequests();
  }

  @Post(':id/approve-publish-request')
  @ApiOperation({ summary: 'Approve a publish request' })
  async approvePublishRequest(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.guardianService.approvePublishRequest(id, userId);
  }

  @Post(':id/reject-publish-request')
  @ApiOperation({ summary: 'Reject a publish request' })
  async rejectPublishRequest(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() dto: RejectSponsorshipRequestDto,
  ) {
    return this.guardianService.rejectPublishRequest(id, userId, dto.reason);
  }
}
