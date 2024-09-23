import { Injectable } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Role } from 'src/common/constants/routes.constant';
import { UserType } from '../users/types/user.type';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,){}
  create(createAnalyticsDto: CreateAnalyticsDto) {
    return 'This action adds a new analytics';
  }

  findAll() {
    return `This action returns all analytics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analytics`;
  }

  update(id: number, updateAnalyticsDto: UpdateAnalyticsDto) {
    return `This action updates a #${id} analytics`;
  }

  remove(id: number) {
    return `This action removes a #${id} analytics`;
  }

  async countOrphansSponsorsAndGuardians() {
    const [orphansCount, sponsorsCount, guardiansCount] = await Promise.all([
      this.prisma.user.count({
        where: {
          roles: {
            some: {
              roleName: UserType.ORPHAN,
            },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          roles: {
            some: {
              roleName: UserType.SPONSOR,
            },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          roles: {
            some: {
              roleName: UserType.GUARDIAN,
            },
          },
        },
      }),
    ]);
  
    return {
      orphansCount,
      sponsorsCount,
      guardiansCount,
    };
  }
  
}
