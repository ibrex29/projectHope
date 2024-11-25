import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/constants/routes.constant';

@ApiTags('Analytics')
@Public()
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Endpoint to get all dashboard metrics
  @Get('dashboard-metrics')
  async getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  // Existing method to get counts of Orphans, Sponsors, and Guardians
  @Get('counts')
  async getUserRolesCounts() {
    return this.analyticsService.countOrphansSponsorsAndGuardians();
  }
}



// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AnalyticsService } from './analytics.service';
// import { CreateAnalyticsDto } from './dto/create-analytics.dto';
// import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { Public } from 'src/common/constants/routes.constant';

// @ApiTags('Analytics')
// @Public()
// @ApiBearerAuth()
// @Controller('analytics')
// export class AnalyticsController {
//   constructor(private readonly analyticsService: AnalyticsService) {}

//   @Post()
//   create(@Body() createAnalyticsDto: CreateAnalyticsDto) {
//     return this.analyticsService.create(createAnalyticsDto);
//   }

//   //Renamed the endpoint to @Get("counts") and the method to getUserRolesCounts().
// 	//This makes it clearer that the endpoint provides aggregated counts of different user roles.
//   //@Get("analytics")
//   //AllOrphans() {
//   @Get("counts")
//   getUserRolesCounts() {
//     return this.analyticsService.countOrphansSponsorsAndGuardians();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.analyticsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAnalyticsDto: UpdateAnalyticsDto) {
//     return this.analyticsService.update(+id, updateAnalyticsDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.analyticsService.remove(+id);
//   }

// }
