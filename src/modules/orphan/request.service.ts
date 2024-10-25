import { Injectable, NotFoundException } from "@nestjs/common";
import { Orphan } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { Status, DeleteStatus } from "src/common/types/status.type";
import { CreateRequestDto } from "./dto/create-request.dto";
import { OrphanRemovalDto } from "./dto/orphan-request-removal.dto";
import { RequestRemovalDto } from "./dto/request-removal.dto";
import { Request as PrismaRequest } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

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

    // async  getUsersWithAcceptedOrphans() {
    //   try {
    //     const usersWithAcceptedOrphans = await this.prisma.user.findMany({
    //       where: {
    //         isDeleted: false,
    //         roles: {
    //           some: {
    //             roleName: 'orphan',
    //           },
    //         },
    //         Orphan: {
    //           some: {
    //             isAccepted: true,
    //           },
    //         },
    //       },
    //       include: {
    //         Orphan: true, // This will help you debug by seeing which orphans are linked
    //       },
    //     });
    
    //     console.log('Users with accepted orphans:', usersWithAcceptedOrphans);
    //     return usersWithAcceptedOrphans; // Return the result for further processing
    //   } catch (error) {
    //     console.error('Error fetching users with accepted orphans:', error);
    //     throw error; // Rethrow the error for further handling
    //   }
    // }

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