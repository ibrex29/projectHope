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

  @Get('counts')
  getUserRolesCounts() {
    return this.analyticsService.countOrphansSponsorsAndGuardians();
  }
}
