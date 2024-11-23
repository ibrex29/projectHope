import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';
import { RoleNotFoundException } from '../users/exceptions/RoleNotFound.exception';
import { UserAlreadyExistsException } from '../users/exceptions/UserAlreadyExists.exception';
import { UserType } from '../users/types/user.type';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Injectable()
export class GuardianService {
  constructor(private readonly prisma:PrismaService){}

  async createGuardian(userDetails: CreateGuardianDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userDetails.email,
      },
    });

    if (user) {
      throw new UserAlreadyExistsException();
    }

    const roleName = UserType.GUARDIAN;

    const role = await this.prisma.role.findUnique({
      where: {
        roleName,
      },
    });

    if (!role) {
      throw new RoleNotFoundException(`Role '${roleName}' not found`);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);

    return this.prisma.user.create({
      data: {
        email: userDetails.email,
        password: hashedPassword,
        phoneNumber: userDetails.phoneNumber,
        isActive: true,
        roles: {
          connectOrCreate: {
            where: {
              roleName,
            },
            create: {
              roleName,
            },
          },
        },
        profile: {
          create: {
            firstName: userDetails.profile.firstName,
            middleName: userDetails.profile.middleName || null,
            lastName: userDetails.profile.lastName,
            dateOfBirth: userDetails.profile.dateOfBirth,
          },
        },
      },
    });
  }

  async updateGuardian(guardianId: string, updateData: UpdateGuardianDto): Promise<User> {
    const guardian = await this.prisma.user.findUnique({
      where: { id: guardianId },
      include: { roles: true, profile: true },
    });
  
    if (!guardian) {
      throw new Error(`Guardian with ID ${guardianId} not found.`);
    }
  
    const isGuardian = guardian.roles.some(role => role.roleName === UserType.GUARDIAN);
    if (!isGuardian) {
      throw new Error('User is not a Guardian');
    }
  
    // Perform the update operation
    return this.prisma.user.update({
      where: { id: guardianId },
      data: {
        email: updateData.email,
        password: updateData.password,
        phoneNumber: updateData.phoneNumber,
        profile: {
          update: {
            firstName: updateData.profile?.firstName,
            middleName: updateData.profile?.middleName,
            lastName: updateData.profile?.lastName,
            dateOfBirth: updateData.profile?.dateOfBirth,
            updatedBy: {
              connect: { id: guardianId },
            },
          },
        },
      },
    });
  }

  async getAllGuardian(): Promise<User[]> {
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
          roles: { some: { roleName: UserType.GUARDIAN } },
        },
        include: {
          profile: true,
          Orphan: includeOrphanDetails,
        },
      });
    } catch (error) {
      console.error(`Error fetching users with Guardian role: ${error.message}`);
      throw new Error(`Error fetching users with Guardian role: ${error.message}`);
    }
  }

  async hasOrphans(guardianId: string): Promise<{ hasOrphans: boolean; hasProfile: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: guardianId },
      include: {
        roles: true,
        profile: true, // Include profile information
      },
    });
  
    if (!user) {
      throw new Error(`User with ID ${guardianId} not found.`);
    }
  
    const orphanCount = await this.prisma.orphan.count({
      where: { createdByUserId: guardianId },
    });
  
    // Check if the user has profile information
    const hasProfile = !!user.profile;
  
    return { 
      hasOrphans: orphanCount > 0,
      hasProfile, 
    };
  }
  
  
  async getTopGuardian(): Promise<{ name: string; email: string; profilePicture: string | null; orphanCount: number }[]> {
  const guardians = await this.prisma.user.findMany({
    where: {
      isDeleted: false,
      roles: { some: { roleName: UserType.GUARDIAN } },
    },
    select: {
      email: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          picture: true,
        },
      },
      id: true,
    },
  });

  const orphanCounts = await Promise.all(
    guardians.map(async (guardian) => {
      const orphanCount = await this.prisma.orphan.count({
        where: { createdByUserId: guardian.id },
      });
      return orphanCount;
    })
  );

  return guardians
    .map((guardian, index) => ({
      name: `${guardian.profile.firstName} ${guardian.profile.lastName}`,
      email: guardian.email,
      profilePicture: guardian.profile.picture,
      orphanCount: orphanCounts[index],
    }))
    .sort((a, b) => b.orphanCount - a.orphanCount);
}
}