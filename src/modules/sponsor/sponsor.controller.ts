import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("sponsor")
@Controller('sponsor')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @Post()
  create(@Body() createSponsorDto: CreateSponsorDto) {
    return this.sponsorService.create(createSponsorDto);
  }

  @Get()
  findAll() {
    return this.sponsorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sponsorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSponsorDto: UpdateSponsorDto) {
    return this.sponsorService.update(+id, updateSponsorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sponsorService.remove(+id);
  }
}
