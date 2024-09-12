import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrphanDto } from './dto/create-orphan.dto';
import { UpdateOrphanDto } from './dto/update-orphan.dto';
import { PrismaService } from 'prisma/prisma.service';
import { generateTrackingNumber } from 'src/common/utils/generate-tracking-number';
import { UserType } from '../users/types/user.type';
import { RoleNotFoundException } from '../users/exceptions/RoleNotFound.exception';
import { profile } from 'console';
import { User } from '@prisma/client';

@Injectable()
export class OrphanService {
  constructor(private readonly prisma:PrismaService){}

  async createOrphanAccount(createOrphanDto: CreateOrphanDto,userId:string) {

    const roleName = UserType.ORPHAN;

    const role = await this.prisma.role.findUnique({
      where: {
        roleName,
      },
    });

    if (!role) {
      throw new RoleNotFoundException(`Role '${roleName}' not found`);
    }

    // Find the local government by name to get its ID
    const localGovernment = await this.prisma.localGovernment.findFirst({
      where: { name: createOrphanDto.localGovernment },
    });
  
    if (!localGovernment) {
      throw new ConflictException('Local government not found');
    }

    // Create a new user
    const user = await this.prisma.user.create({
      data: {
        email: null, 
        password: "null",
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
            firstName: createOrphanDto.firstName,
            middleName: createOrphanDto.middleName,
            lastName: createOrphanDto.lastName,
            localGovernment: {
              connect: { id: localGovernment.id },
            },
            dateOfBirth: createOrphanDto.dateOfBirth,
            phoneNumber: createOrphanDto.schoolContactPhone,
            gender: createOrphanDto.gender,
            picture: createOrphanDto.picture,
           
          },
        },
      },
    });
    
    const trackingNumber = generateTrackingNumber();
    // Create a new orphan and associate it with the user
    const orphan = await this.prisma.orphan.create({
      data: {
        trackingNumber: trackingNumber,
        picture: createOrphanDto.picture,
        affidavitOfGuardianship: createOrphanDto.affidavitOfGuardianship,
        schoolStatus: createOrphanDto.isEnrolled,
        schoolName: createOrphanDto.schoolName,
        schoolAddress: createOrphanDto.schoolAddress,
        schoolContactPerson: createOrphanDto.schoolContactPerson,
        schoolContactPhone: createOrphanDto.schoolContactPhone,
        userId: user.id, 
        createdByUserId:userId,
      },
    });

  // Retrieve the profile to return it along with user and orphan if needed
  const profile = await this.prisma.profile.findUnique({
    where: { userId: user.id },
  });
   
    return {orphan,user,profile};
  }

  async getOrphans(): Promise<User[]> {
    try {
      // Fetch users with the "orphan" role along with their profiles and orphans
      return await this.prisma.user.findMany({
        where: {
          roles: {
            some: {
              roleName: UserType.SPONSOR, // Replace with the actual role name if different
            },
          },
        },
        include: {
          profile: true,
          Orphan: true, 
        },
      });
    } catch (error) {
      // Handle potential errors
      throw new Error(`Error fetching users with orphan role: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all orphan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orphan`;
  }

  update(id: number, updateOrphanDto: UpdateOrphanDto) {
    return `This action updates a #${id} orphan`;
  }

  remove(id: number) {
    return `This action removes a #${id} orphan`;
  }
}