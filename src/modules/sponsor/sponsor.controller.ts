import { Controller, Body, Get, Param, Patch, Post, UseGuards,} from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateDonationDto } from './dto/create-donation.dto';
import { Public } from 'src/common/constants/routes.constant';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateDonationDto } from './dto/donation/create-donation.dto';


@ApiTags("sponsor")
@ApiBearerAuth()
@Controller({ path: 'sponsor', version: '1' })
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  // @Patch()
  // async createDonation(@Body() updateDonationDto: UpdateDonationDto,@User('userId') userId: string) {
  //   return this.sponsorService.createDonationByRequest(updateDonationDto,userId);
  // }

  // @Get()
  // async getAllSponsor(){
  //   return this.sponsorService.getAllSponsors();
  // }

  // @Get('my-donation')
  // async getDonationsByUser(@User('userId') userId: string) {
  //   return this.sponsorService.getDonationsAndRequestsByUser(userId);
  // }

  @Post()
  // @ApiBearerAuth() // API requires authentication
  @ApiOperation({ summary: 'Create a new donation' })
  async create(@Body() createDonationDto: CreateDonationDto, @User('userId') userId: string) {
    return this.sponsorService.create(createDonationDto, userId);
  }


  @Get('my-donations')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my donations' })
  async getMyDonations(@User('userId') userId: string) {
    return this.sponsorService.getUserDonations(userId);
  }

}