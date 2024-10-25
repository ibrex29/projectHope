import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrphanDto } from './dto/create-orphan.dto';
import { UserType } from '../users/types/user.type';
import { RoleNotFoundException } from '../users/exceptions/RoleNotFound.exception';
import { PrismaService } from 'prisma/prisma.service';
import { generateTrackingNumber } from 'src/common/utils/generate-tracking-number';
import { Orphan, User } from '@prisma/client';
import { Request as PrismaRequest } from '@prisma/client';
import { CreateRequestDto } from './dto/create-request.dto';
import { DeleteStatus, Status } from 'src/common/types/status.type';
import { RequestRemovalDto } from './dto/request-removal.dto';
import { OrphanRemovalDto } from './dto/orphan-request-removal.dto';

@Injectable()
export class OrphanService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(createOrphanDto: CreateOrphanDto, userId: string, localGovernmentId: string) {
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
    if (!localGovernment) throw new ConflictException('Local government not found');

    const createdUser = await this.prisma.user.create({
      data: {
        email: null,
        password: "null",
        isActive:true,
        isVerified:true,
        roles: {
          connectOrCreate: {
            where: { roleName },
            create: { roleName },
          },
        },
      },
    });

    const profile = await this.createProfile(createOrphanDto, createdUser.id, localGovernment.id);
    const trackingNumber = generateTrackingNumber();

    const orphan = await this.prisma.orphan.create({
      data: {
        trackingNumber,
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

  async acceptOrphan(orphanId: string, userId: string): Promise<Orphan> {
    const orphan = await this.prisma.orphan.findUnique({ where: { id: orphanId } });
    
    if (!orphan) throw new NotFoundException(`Orphan with ID '${orphanId}' not found`);

    return this.prisma.orphan.update({
      where: { id: orphanId },
      data: { isAccepted: true, updatedByUserId: userId },
    });
  }

  async rejectOrphan(orphanId: string, userId: string): Promise<Orphan> {
    const orphan = await this.prisma.orphan.findUnique({ where: { id: orphanId } });
    
    if (!orphan) throw new NotFoundException(`Orphan with ID '${orphanId}' not found`);

    return this.prisma.orphan.update({
      where: { id: orphanId },
      data: { isAccepted: false, updatedByUserId: userId },
    });
  }

  async verifyUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        updatedAt: new Date(),
      },
    });
  }

  async getMyOrphans(userId: string): Promise<Orphan[]> {
    try {
      return await this.prisma.orphan.findMany({
        where: {
          isDeleted: DeleteStatus.NOT_DELETED, 
          createdByUserId: userId, 
        },
        include: {
          requests: {
            include: {
              donations: true, 
              needs: true,  
            },
          },
          createdBy: true,
          updatedBy: true,
          user: true, 
        },
      });
    } catch (error) {
      console.error(`Error fetching orphans created by user ${userId}: ${error.message}`);
      throw new Error(`Error fetching orphans created by user ${userId}: ${error.message}`);
    }
  }
  
  async getAllOrphans(): Promise<User[]> {
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
          roles: { some: { roleName: UserType.ORPHAN } },
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

  async createNeedRequest(createRequestDto: CreateRequestDto, userId: string) {
    const { orphanId, description, needs, amountNeeded,amountRecieved } = createRequestDto;
  
    // Check if the orphan exists
    const orphan = await this.prisma.orphan.findUnique({ where: { id: orphanId } });
    if (!orphan) {
      throw new NotFoundException(`Orphan with ID '${orphanId}' not found`);
    }
  
    const needData = needs?.map(need => ({
      name: need.name,
      description: need.description,
      additionalInfo: need.additionalInfo,
      supportiveDocuments: need.supportiveDocuments,
    })) || [];
  
    // Create the request
    const request = await this.prisma.request.create({
      data: {
        description,
        orphanId,
        createdByUserId: userId,
        userId: userId,
        status: Status.PENDING,
        isDeleted:DeleteStatus.NOT_DELETED,
        needs: {
          create: needData,
        },
        donations: {
          create: { 
            amountNeeded: amountNeeded , 
            userId: orphan.userId,
            amountRecieved:amountRecieved 
          },
        },
      },
      include: {
        needs: true,
        donations: true,
      },
    });
  
    return request;
  }

  async orphanDeletionRequest(dto: OrphanRemovalDto, userId: string): Promise<Orphan> {
    if (!dto.orphanId) {
      throw new Error("Request ID must be provided");
    }
  
    const request = await this.prisma.orphan.findUnique({
      where: { id: dto.orphanId },
    });
  
    if (!request) {
      throw new NotFoundException(`Request with ID '${dto.orphanId}' not found`);
    }
  
    const updatedRequest = await this.prisma.orphan.update({
      where: { id: dto.orphanId },
      data: {
        isDeleted: DeleteStatus.REQUEST_DELETION,
        deletionReason: dto.deletionReason,
        updatedByUserId: userId,
      },
    });
  
    return updatedRequest;
  }
  

  async deleteOrphan(orphanId: string, userId: string): Promise<Orphan> {
    const orphan = await this.prisma.orphan.findUnique({ where: { id: orphanId } });
    
    if (!orphan) throw new NotFoundException(`Orphan with ID '${orphanId}' not found`);

    return this.prisma.orphan.update({
      where: { id: orphanId },
      data: { isDeleted: DeleteStatus.DELETED, updatedByUserId: userId },
    });
  }

  async needRequestRemoval(dto: RequestRemovalDto, userId: string): Promise<PrismaRequest> {
    // Check if the requestId is not provided
    if (!dto.requestId) {
      throw new Error("Orphan ID must be provided");
    }
  
    const request = await this.prisma.request.findUnique({
      where: { id: dto.requestId },
    });
  
    if (!request) {
      throw new NotFoundException(`Orphan with ID '${dto.requestId}' not found`);
    }
  
    const updatedRequest = await this.prisma.request.update({
      where: { id: dto.requestId },
      data: {
        isDeleted: DeleteStatus.REQUEST_DELETION,
        deletionReason: dto.rejectionReason,
        updatedByUserId: userId,
      },
    });
  
    return updatedRequest;
  }

    async deleteNeedRequest(requestId: string, userId: string) {
      return this.prisma.request.update({
        where: { id: requestId },
        data: { isDeleted: DeleteStatus.DELETED, updatedByUserId: userId },
      });
    }

    async listAllRequests() {
      try {
        const requests = await this.prisma.request.findMany({
          where: {
            isDeleted: DeleteStatus.REQUEST_DELETION,          },
          include: {
            orphan: true,       
            donations: true,   
            needs: true,      
            user: {
              select:{
                profile:true,
              }
            },        
            createdBy: true,    
            updatedBy: true,    
          },
        });
        return requests;
      } catch (error) {
        throw new Error(`Failed to list all requests: ${error.message}`);
      }
    }
  }
