import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserType } from '../users/types/user.type';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,){}
 
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
