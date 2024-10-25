import { Controller, Body, Get, Param, Patch,} from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateDonationDto } from './dto/create-donation.dto';
import { Public } from 'src/common/constants/routes.constant';
import { User } from 'src/common/decorators/param-decorator/User.decorator';


@ApiTags("sponsor")
@ApiBearerAuth()
@Controller({ path: 'sponsor', version: '1' })
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @Patch()
  async createDonation(@Body() updateDonationDto: UpdateDonationDto,@User('userId') userId: string) {
    return this.sponsorService.createDonationByRequest(updateDonationDto,userId);
  }

  @Get()
  async getAllSponsor(){
    return this.sponsorService.getAllSponsors();
  }

  @Get('my-donation')
  async getDonationsByUser(@User('userId') userId: string) {
    return this.sponsorService.getDonationsAndRequestsByUser(userId);
  }

}