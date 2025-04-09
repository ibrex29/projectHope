import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Orphan, Status } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { RoleNotFoundException } from '../users/exceptions/RoleNotFound.exception';
import { UserType } from '../users/types/user.type';
import { CreateOrphanDto } from './dto/create-orphan.dto';
import { UpdateOrphanDto } from './dto/update-orphan.dto';

@Injectable()
export class OrphanService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(
    createOrphanDto: CreateOrphanDto,
    userId: string,
    localGovernmentId: string,
  ) {
    return this.prisma.profile.create({
      data: {
        firstName: createOrphanDto.firstName,
        middleName: createOrphanDto.middleName,
        lastName: createOrphanDto.lastName,
        localGovernment: {
          connect: { id: localGovernmentId },
        },
        dateOfBirth: createOrphanDto.dateOfBirth,
        phoneNumber: createOrphanDto.schoolContactPhone,
        gender: createOrphanDto.gender,
        picture: createOrphanDto.picture,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async createOrphanAccount(createOrphanDto: CreateOrphanDto, userId: string) {
    const roleName = UserType.ORPHAN;

    const role = await this.prisma.role.findUnique({ where: { roleName } });
    if (!role) throw new RoleNotFoundException(`Role '${roleName}' not found`);

    const localGovernment = await this.prisma.localGovernment.findFirst({
      where: { name: createOrphanDto.localGovernment },
    });
    if (!localGovernment)
      throw new ConflictException('Local government not found');

    const createdUser = await this.prisma.user.create({
      data: {
        email: null,
        password: 'null',
        isActive: true,
        isVerified: true,
        roles: {
          connectOrCreate: {
            where: { roleName },
            create: { roleName },
          },
        },
      },
    });

    const profile = await this.createProfile(
      createOrphanDto,
      createdUser.id,
      localGovernment.id,
    );

    const orphan = await this.prisma.orphan.create({
      data: {
        picture: createOrphanDto.picture,
        affidavitOfGuardianship: createOrphanDto.affidavitOfGuardianship,
        schoolStatus: createOrphanDto.isEnrolled,
        schoolName: createOrphanDto.schoolName,
        schoolAddress: createOrphanDto.schoolAddress,
        schoolContactPerson: createOrphanDto.schoolContactPerson,
        schoolContactPhone: createOrphanDto.schoolContactPhone,
        userId: createdUser.id,
        createdByUserId: userId,
      },
    });

    return { orphan, createdUser, profile };
  }

  async updateProfile(
    updateOrphanDto: UpdateOrphanDto,
    userId: string,
    localGovernmentId: string,
  ) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        firstName: updateOrphanDto.firstName ?? undefined,
        middleName: updateOrphanDto.middleName ?? undefined,
        lastName: updateOrphanDto.lastName ?? undefined,
        localGovernment: {
          connect: { id: localGovernmentId },
        },
        dateOfBirth: updateOrphanDto.dateOfBirth ?? undefined,
        phoneNumber: updateOrphanDto.schoolContactPhone ?? undefined,
        gender: updateOrphanDto.gender ?? undefined,
        picture: updateOrphanDto.picture ?? undefined,
      },
    });
  }

  async updateOrphanAccount(
    orphanId: string,
    updateOrphanDto: UpdateOrphanDto,
    userId: string,
  ) {
    // Step 1: Fetch the orphan to be updated
    const orphan = await this.prisma.orphan.findUnique({
      where: { id: orphanId },
    });

    if (!orphan) {
      throw new NotFoundException('Orphan account not found');
    }

    // Step 2: Fetch the associated local government
    const localGovernment = await this.prisma.localGovernment.findFirst({
      where: { name: updateOrphanDto.localGovernment },
    });

    if (!localGovernment) {
      throw new ConflictException('Local government not found');
    }

    // Step 3: Check if the orphan has an associated user profile
    const user = await this.prisma.user.findUnique({
      where: { id: orphan.userId },
    });

    if (!user) {
      throw new NotFoundException('User profile not found for this orphan');
    }

    // Step 4: Update the user profile if necessary (e.g., updating profile details)
    const updatedProfile = await this.updateProfile(
      updateOrphanDto,
      orphan.userId,
      localGovernment.id,
    );

    // Step 5: Update orphan details
    const updatedOrphan = await this.prisma.orphan.update({
      where: { id: orphanId },
      data: {
        picture: updateOrphanDto.picture ?? orphan.picture,
        affidavitOfGuardianship:
          updateOrphanDto.affidavitOfGuardianship ??
          orphan.affidavitOfGuardianship,
        schoolStatus: updateOrphanDto.isEnrolled ?? orphan.schoolStatus,
        schoolName: updateOrphanDto.schoolName ?? orphan.schoolName,
        schoolAddress: updateOrphanDto.schoolAddress ?? orphan.schoolAddress,
        schoolContactPerson:
          updateOrphanDto.schoolContactPerson ?? orphan.schoolContactPerson,
        schoolContactPhone:
          updateOrphanDto.schoolContactPhone ?? orphan.schoolContactPhone,
        updatedByUserId: userId,
      },
    });

    return { updatedOrphan, updatedProfile };
  }

  async approveOrphan(orphanId: string, userId: string): Promise<Orphan> {
    const orphan = await this.prisma.orphan.findUnique({
      where: { id: orphanId },
    });

    if (!orphan)
      throw new NotFoundException(`Orphan with ID '${orphanId}' not found`);

    return this.prisma.orphan.update({
      where: { id: orphanId },
      data: { status: 'approved', updatedByUserId: userId },
    });
  }

  async rejectOrphan(
    orphanId: string,
    userId: string,
    reason?: string,
  ): Promise<Orphan> {
    const orphan = await this.prisma.orphan.findUnique({
      where: { id: orphanId },
    });

    if (!orphan)
      throw new NotFoundException(`Orphan with ID '${orphanId}' not found`);

    return this.prisma.orphan.update({
      where: { id: orphanId },
      data: {
        status: 'rejected',
        updatedByUserId: userId,
        ActionLog: {
          create: {
            fromStatus: 'pending',
            toStatus: 'rejected',
            actionType: 'rejection',
            reason: reason,
          },
        },
      },
    });
  }

  async getMyOrphans(userId: string): Promise<Orphan[]> {
    try {
      return await this.prisma.orphan.findMany({
        where: {
          createdByUserId: userId,
        },
        include: {
          createdBy: true,
          updatedBy: true,
          user: {
            include: {
              profile: {
                include: {
                  localGovernment: {
                    include: {
                      state: true,
                    },
                  },
                },
              },
            },
          },
          ActionLog: true,
        },
      });
    } catch (error) {
      console.error(
        `Error fetching orphans created by user ${userId}: ${error.message}`,
      );
      throw new Error(
        `Error fetching orphans created by user ${userId}: ${error.message}`,
      );
    }
  }

  async getAllOrphans(): Promise<Orphan[]> {
    try {
      const orphans = await this.prisma.orphan.findMany({
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          ActionLog: true,
        },
      });

      return orphans;
    } catch (error) {
      console.error(`Error fetching users with orphan role: ${error.message}`);
      throw new Error(
        `Error fetching users with orphan role: ${error.message}`,
      );
    }
  }

  async deleteOrphan(orphanId: string): Promise<Orphan> {
    const orphan = await this.prisma.orphan.findUnique({
      where: { id: orphanId },
    });

    if (!orphan)
      throw new NotFoundException(`Orphan with ID '${orphanId}' not found`);

    if (orphan.status === Status.draft) {
      await this.prisma.orphan.delete({
        where: {
          id: orphan.id,
        },
      });
      return;
    } else {
      throw Error('Only draft orphans can be deleted by the user');
    }
  }

  async submitOrphan(orphanId: string) {
    await this.prisma.orphan.update({
      where: {
        id: orphanId,
      },
      data: {
        status: 'pending',
      },
    });

    return;
  }
}
