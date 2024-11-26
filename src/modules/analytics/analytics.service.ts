import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  // Method to count Orphans, Sponsors, and Guardians
  async countOrphansSponsorsAndGuardians() {
    const [orphansCount, sponsorsCount, guardiansCount] = await Promise.all([
      this.prisma.orphan.count({
        where: { isAccepted: true },
      }),
      this.prisma.user.count({
        where: {
          roles: {
            some: { roleName: 'sponsor' },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          roles: {
            some: { roleName: 'guardian' },
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

  // Method to count Sponsorship Requests
  async countSponsorshipRequests() {
    const sponsorshipRequests = await this.prisma.request.count();
    return sponsorshipRequests;
  }

  // Method to calculate Sponsorship Gotten (sum of amountReceived in donations)
  async calculateSponsorshipGotten() {
    const sponsorshipGotten = await this.prisma.donation.aggregate({
      _sum: { amountRecieved: true },
    });
    return sponsorshipGotten._sum.amountRecieved || 0;
  }

  // Method to count Orphans' Needs
  async countOrphansNeeds() {
    const orphansNeeds = await this.prisma.need.count();
    return orphansNeeds;
  }

  // Combined method to fetch all metrics
  async getDashboardMetrics() {
    const [
      { orphansCount, sponsorsCount, guardiansCount },
      sponsorshipRequests,
      sponsorshipGotten,
      orphansNeeds,
    ] = await Promise.all([
      this.countOrphansSponsorsAndGuardians(),
      this.countSponsorshipRequests(),
      this.calculateSponsorshipGotten(),
      this.countOrphansNeeds(),
    ]);

    return {
      numberOfOrphans: orphansCount,
      numberOfSponsors: sponsorsCount,
      numberOfGuardians: guardiansCount,
      sponsorshipRequests,
      sponsorshipGotten,
      orphansNeeds,
    };
  }
}



// import { Injectable } from '@nestjs/common';
// import { CreateAnalyticsDto } from './dto/create-analytics.dto';
// import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
// import { PrismaService } from 'prisma/prisma.service';
// import { Role } from 'src/common/constants/routes.constant';
// import { UserType } from '../users/types/user.type';

// @Injectable()
// export class AnalyticsService {
//   constructor(
//     private prisma: PrismaService,){}
//   create(createAnalyticsDto: CreateAnalyticsDto) {
//     return 'This action adds a new analytics';
//   }

//   findAll() {
//     return `This action returns all analytics`;
//   }

  // findOne(id: number) {
  //   return `This action returns a #${id} analytics`;
  // }

//   update(id: number, updateAnalyticsDto: UpdateAnalyticsDto) {
//     return `This action updates a #${id} analytics`;
//   }

  // remove(id: number) {
  //   return `This action removes a #${id} analytics`;
  // }

//   async countOrphansSponsorsAndGuardians() {
//     const [orphansCount, sponsorsCount, guardiansCount] = await Promise.all([
//       this.prisma.user.count({
//         where: {
//           roles: {
//             some: {
//               roleName: UserType.ORPHAN,
//             },
//           },
//         },
//       }),
//       this.prisma.user.count({
//         where: {
//           roles: {
//             some: {
//               roleName: UserType.SPONSOR,
//             },
//           },
//         },
//       }),
//       this.prisma.user.count({
//         where: {
//           roles: {
//             some: {
//               roleName: UserType.GUARDIAN,
//             },
//           },
//         },
//       }),
//     ]);
  
//     return {
//       orphansCount,
//       sponsorsCount,
//       guardiansCount,
//     };
//   }
  
// }
