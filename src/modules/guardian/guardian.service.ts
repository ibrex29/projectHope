import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SponsorshipRequest, User } from '@prisma/client';
import { RoleNotFoundException } from '../users/exceptions/RoleNotFound.exception';
import { UserAlreadyExistsException } from '../users/exceptions/UserAlreadyExists.exception';
import { UserType } from '../users/types/user.type';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { CreateSponsorshipRequestDto, UpdateSponsorshipRequestDto, UpdateSupportingDocumentDto } from './dto/create-sponsorship-request.dto';
import { ActionType, SponsorshipStatus } from './dto/types.enum';
import { PaginationMetadataDTO } from 'src/common/dto/page-meta.dto';
import { FetchSponsorshipRequestDto } from '../sponsor/dto/fetch-requestt.dto';

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
          // Orphan: includeOrphanDetails,
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

async create(dto: CreateSponsorshipRequestDto, userId: string) {
  return await this.prisma.sponsorshipRequest.create({
    data: {
      createdByUserId: userId,
      title: dto.title,
      description: dto.description,
      targetAmount: dto.targetAmount,
      deadline: dto.deadline,
      status: SponsorshipStatus.DRAFT,  
      orphans: {
        connect: dto.orphans.map((orphanId) => ({ id: orphanId })),
      },
      SupportingDocument: dto.supportingDocuments && dto.supportingDocuments.length > 0
        ? {
            create: dto.supportingDocuments.map((doc) => ({
              title: doc.title,
              fileUrl: doc.fileUrl,
              fileType:doc.fileType
            })),
          }
        : undefined,
    },
    include: {
      SupportingDocument: true,
    },
  });
}

async updateRequest(id: string, dto: UpdateSponsorshipRequestDto) {
  return await this.prisma.$transaction(async (tx) => {
    const existingRequest = await tx.sponsorshipRequest.findUnique({ 
      where: { id },
      include: { SupportingDocument: true }
    });
    if (!existingRequest){
      throw new NotFoundException('Sponsorship request not found');
    } 
    if (existingRequest.status !== SponsorshipStatus.DRAFT) {
      throw new BadRequestException('Only draft sponsorship requests can be updated');
    }

    if (dto.supportingDocuments && dto.supportingDocuments.length > 0) {
      await tx.supportingDocument.createMany({
        data: dto.supportingDocuments.map((doc) => ({
          sponsorshipRequestId: id,
          title: doc.title,
          fileUrl: doc.fileUrl,
          fileType: doc.fileType,
        })),
      });
    }

    return await tx.sponsorshipRequest.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        targetAmount: dto.targetAmount,
        deadline: dto.deadline,
        orphans: dto.orphans ? { set: dto.orphans.map((orphanId) => ({ id: orphanId })) } : undefined,
      },
      include: {
        SupportingDocument: true, 
      },
    });
  });
}

async updateSupportingDocument(
  id: string,
  updateData: UpdateSupportingDocumentDto,
) {
  try {
    const document = await this.prisma.supportingDocument.update({
      where: { id },
      data: updateData,
    });
    return document;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundException('Supporting document not found');
    }
  }
}

async deleteDraftRequest(requestId: string): Promise<{ message: string; requestId: string }> {
  return await this.prisma.$transaction(async (tx) => {
    const request = await tx.sponsorshipRequest.findUnique({

      where: { id: requestId },
      select: { id: true, status: true }
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }
    
    if (request.status !== SponsorshipStatus.DRAFT) {
      throw new NotFoundException('Request is not in draft status');
    }
    
    await Promise.all([
      tx.supportingDocument.deleteMany({ where: { sponsorshipRequestId: requestId } }),
      tx.actionLog.deleteMany({ where: { sponsorshipRequestId: requestId } }),
    ]);

    await tx.sponsorshipRequest.delete({ where: { id: requestId } });

    return {
      message: 'Sponsorship request and all related documents have been successfully deleted.',
      requestId,
    };
  });
}

async publishSponsorshipRequest(requestId: string, userId: string): Promise<SponsorshipRequest> {
  return await this.prisma.$transaction(async (prisma) => {
   
    const existingRequest = await prisma.sponsorshipRequest.findUnique({
      where: { id: requestId },
      select: { status: true }, 
    });

    if (!existingRequest) {
      throw new Error("Sponsorship request not found");
    }

    const updatedRequest = await prisma.sponsorshipRequest.update({
      where: { id: requestId },
      data: {
        status: SponsorshipStatus.PENDING,
        updatedByUserId: userId,
      },
    });

    await prisma.actionLog.create({
      data: {
        actionType: ActionType.PUBLISH_SPONSORSHIP_REQUEST,
        fromStatus: existingRequest.status,
        toStatus: SponsorshipStatus.PENDING,
        sponsorshipRequestId: requestId,
        createdByUserId: userId,
      },
    });

    return updatedRequest;
  });
}

async approveSponsorshipRequest(requestId: string, userId: string): Promise<SponsorshipRequest> {
  return await this.prisma.$transaction(async (prisma) => {
   
    const existingRequest = await prisma.sponsorshipRequest.findUnique({
      where: { id: requestId },
      select: { status: true }, 
    });

    if (!existingRequest) {
      throw new Error("Sponsorship request not found");
    }

    const updatedRequest = await prisma.sponsorshipRequest.update({
      where: { id: requestId },
      data: {
        status: SponsorshipStatus.APPROVED,
        updatedByUserId: userId,
      },
    });

    await prisma.actionLog.create({
      data: {
        actionType: ActionType.APPROVE_SPONSORSHIP_REQUEST,
        fromStatus: existingRequest.status,
        toStatus: SponsorshipStatus.APPROVED,
        sponsorshipRequestId: requestId,
        createdByUserId: userId,
      },
    });

    return updatedRequest;
  });
}

async rejectSponsorshipRequest(requestId: string, userId: string, rejectionReason: string): Promise<SponsorshipRequest> {
  return await this.prisma.$transaction(async (prisma) => {
   
    const existingRequest = await prisma.sponsorshipRequest.findUnique({
      where: { id: requestId },
      select: { status: true }, 
    });

    if (!existingRequest) {
      throw new Error("Sponsorship request not found");
    }

    const updatedRequest = await prisma.sponsorshipRequest.update({
      where: { id: requestId },
      data: {
        status: SponsorshipStatus.REJECTED,
        updatedByUserId: userId,
      },
    });

    await prisma.actionLog.create({
      data: {
        actionType: ActionType.REJECT_SPONSORSHIP_REQUEST,
        fromStatus: existingRequest.status,
        toStatus: SponsorshipStatus.REJECTED,
        sponsorshipRequestId: requestId,
        reason:rejectionReason,
        createdByUserId: userId,
      },
    });

    return updatedRequest;
  });
}

async closeSponsorshipRequest(requestId: string, userId: string, closeReason:string): Promise<SponsorshipRequest> {
  return await this.prisma.$transaction(async (prisma) => {
   
    const existingRequest = await prisma.sponsorshipRequest.findUnique({
      where: { id: requestId },
      select: { status: true }, 
    });

    if (!existingRequest) {
      throw new Error("Sponsorship request not found");
    }

    const updatedRequest = await prisma.sponsorshipRequest.update({
      where: { id: requestId },
      data: {
        status: SponsorshipStatus.CLOSED,
        updatedByUserId: userId,
      },
    });

    await prisma.actionLog.create({
      data: {
        actionType: ActionType.CLOSE_SPONSORSHIP_REQUEST,
        fromStatus: existingRequest.status,
        toStatus: SponsorshipStatus.CLOSED,
        reason: closeReason,
        sponsorshipRequestId: requestId,
        createdByUserId: userId,
      },
    });

    return updatedRequest;
  });
}

async getAllSponsorshipRequests(dto: FetchSponsorshipRequestDto) {
  let { page, limit, search, status } = dto;

  page = Math.max(Number(page)); 
  limit = Math.max(Number(limit)); 

  const take = limit > 50 ? 50 : limit;
  const skip = (page - 1) * take;

  const whereCondition: any = {};

  if (search) {
    whereCondition.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    whereCondition.status = status;
  }


  const totalCount = await this.prisma.sponsorshipRequest.count({
    where: whereCondition,
  });

  const sponsorshipRequests = await this.prisma.sponsorshipRequest.findMany({
    where: whereCondition,
    include: {
      orphans: true,
      createdBy: true,
      SupportingDocument:true,
      ActionLog:true,
    },
    orderBy: { createdAt: 'desc' },
    take,
    skip, 
  });

  return {
    data: sponsorshipRequests,
    meta: new PaginationMetadataDTO({ pageOptionsDTO: dto, itemCount: totalCount }),
  };
}

async getSponsorshipRequestById(id: string) {
  return await this.prisma.sponsorshipRequest.findUnique({
    where: { id },
    include: {
      orphans: true,
      createdBy: true,
      SupportingDocument:true,
      ActionLog:true,
    },
  });
}

}