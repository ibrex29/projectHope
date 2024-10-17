import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateDonationDto } from './dto/create-donation.dto';
import { UserType } from '../users/types/user.type';
import { User } from '@prisma/client';
import { profile } from 'console';

@Injectable()
export class SponsorService {
  constructor(private readonly prisma:PrismaService){}

  async updateDonationByRequest(data: UpdateDonationDto,userId:string) {
    try {
      // Find the existing donation using the requestId
      const donation = await this.prisma.donation.findFirst({
        where: {
          requestId: data.requestId,
        },
      });

      if (!donation) {
        throw new Error(`Donation not found for request ID: ${data.requestId}`);
      }

      // Update the donation record
      const updatedDonation = await this.prisma.donation.update({
        where: {
          id: donation.id,
        },
        data: {
          amountDonated: {
            increment: data.amountToDonate, 
          },
          createdByUserId:userId,
          updatedByUserId:userId
        },
      });

      return updatedDonation;
    } catch (error) {
      throw new Error(`Failed to update donation: ${error.message}`);
    }
  }

  async getAllSponsors(): Promise<User[]> {
    try {
      const includeOrphanDetails = {
        include: {
          requests: {
            include: {
              donations: true,
              needs: true,
            },
          },
          createdBy: true,
          updatedBy: true,
        },
      };
  
      return await this.prisma.user.findMany({
        where: {
          isDeleted: false,
          roles: { some: { roleName: UserType.SPONSOR } },
        },
        include: {
          profile: true,
          Orphan: includeOrphanDetails,
        },
      });
    } catch (error) {
      console.error(`Error fetching users with orphan role: ${error.message}`);
      throw new Error(`Error fetching users with orphan role: ${error.message}`);
    }
  }

  async getDonationsAndRequestsByUser(userId: string) {
    try {
      const donations = await this.prisma.donation.findMany({
        where: {
          createdByUserId: userId,
        },
        include: {
          request: {
            include: {
              needs: true,},
            },
            user: {
              include: {
                profile: true, 
                EmployementDetails:true
              },
            },
          },
        });
    
        return donations;
      } catch (error) {
        throw new Error(`Failed to retrieve donations for user: ${error.message}`);
      }
    }

}
