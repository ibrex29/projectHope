import { Controller,Put, Body, Request, Get, Param,} from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateDonationDto } from './dto/create-donation.dto';
import { User } from '@prisma/client';
import { Public } from 'src/common/constants/routes.constant';


@ApiTags("sponsor")
@ApiBearerAuth()
@Controller('sponsor')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @Put()
  async updateDonation(@Body() updateDonationDto: UpdateDonationDto,@Request() req) {
    const userId = req.user?.userId;
    return this.sponsorService.updateDonationByRequest(updateDonationDto,userId);
  }

  @Public()
  @Get()
  async getAllOrphans(): Promise<User[]> {
    return this.sponsorService.getAllSponsors();
  }

  @Get('user/:userId')
  async getDonationsByUser(@Param('userId') userId: string) {
    return this.sponsorService.getDonationsAndRequestsByUser(userId);
  }

  
 
}