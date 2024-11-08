import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dtos/user/create-user.dto';
import { RoleNotFoundException } from '../users/exceptions/RoleNotFound.exception';
import { UserAlreadyExistsException } from '../users/exceptions/UserAlreadyExists.exception';
import { UserType } from '../users/types/user.type';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';

@Injectable()
export class GuardianService {
  constructor(private readonly prisma:PrismaService){}

  async createGuardian(userDetails: CreateUserDto): Promise<User> {
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

  //Checking if guardian has orphan
  // async hasOrphans(guardianId: string): Promise<{ hasOrphans: boolean; count: number }> {
  //   try {
  //     const count = await this.prisma.orphan.count({
  //       where: { userId: guardianId },
  //     });
  
  //     return { hasOrphans: count > 0, count };
  //   } catch (error) {
  //     console.error(`Error checking orphans for guardian ${guardianId}: ${error.message}`);
  //     throw new Error(`Error retrieving orphans for guardian with ID ${guardianId}.`);
  //   }
  // }

  async hasOrphans(guardianId: string): Promise<{ hasOrphans: boolean }> {
    try {
      const userWithRoleAndOrphans = await this.prisma.user.findUnique({
        where: { id: guardianId },
        include: {
          roles: true,
          Orphan: true,
        },
      });
  
      if (!userWithRoleAndOrphans) {
        throw new Error(`User with ID ${guardianId} not found.`);
      }
  
      const isGuardian = userWithRoleAndOrphans.roles.some(role => role.roleName === UserType.GUARDIAN);
  
      if (!isGuardian) {
        return { hasOrphans: false };
      }
  
      const orphanCount = userWithRoleAndOrphans.Orphan.length;
  
      return { hasOrphans: orphanCount > 0};
      } catch (error) {
        console.error(`Error checking orphans for guardian ${guardianId}: ${error.message}`);
        throw new Error(`Failed to retrieve orphans for guardian with ID ${guardianId}.`);
      }
  }
  
}
