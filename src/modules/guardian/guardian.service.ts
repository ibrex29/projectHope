import { Injectable, NotFoundException } from '@nestjs/common';
import { SponsorshipRequest, Status, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { RoleNotFoundException } from '../users/exceptions/RoleNotFound.exception';
import { UserAlreadyExistsException } from '../users/exceptions/UserAlreadyExists.exception';
import { UserType } from '../users/types/user.type';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import {
  CreateSponsorshipRequestDto,
  RequestSponsorshipRequestEditDto,
  UpdateSponsorshipRequestDto,
  UpdateSupportingDocumentDto,
} from './dto/create-sponsorship-request.dto';
import { ActionType, SponsorshipStatus } from './dto/types.enum';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Injectable()
export class GuardianService {
  constructor(private readonly prisma: PrismaService) {}

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

  async updateGuardian(
    guardianId: string,
    updateData: UpdateGuardianDto,
  ): Promise<User> {
    const guardian = await this.prisma.user.findUnique({
      where: { id: guardianId },
      include: { roles: true, profile: true },
    });

    if (!guardian) {
      throw new Error(`Guardian with ID ${guardianId} not found.`);
    }

    const isGuardian = guardian.roles.some(
      (role) => role.roleName === UserType.GUARDIAN,
    );
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
      console.error(
        `Error fetching users with Guardian role: ${error.message}`,
      );
      throw new Error(
        `Error fetching users with Guardian role: ${error.message}`,
      );
    }
  }

  async hasOrphans(
    guardianId: string,
  ): Promise<{ hasOrphans: boolean; hasProfile: boolean }> {
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

  async getTopGuardian(): Promise<
    {
      name: string;
      email: string;
      profilePicture: string | null;
      orphanCount: number;
    }[]
  > {
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
      }),
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
        SupportingDocument:
          dto.supportingDocuments && dto.supportingDocuments.length > 0
            ? {
                create: dto.supportingDocuments.map((doc) => ({
                  title: doc.title,
                  description: doc.description,
                  url: doc.url,
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
        include: { SupportingDocument: true },
      });
      if (!existingRequest) {
        throw new NotFoundException('Sponsorship request not found');
      }

      if (dto.supportingDocuments) {
        const existingDocs = existingRequest.SupportingDocument;
        const existingDocIds = new Set(existingDocs.map((doc) => doc.id));
        const updatedDocIds = new Set(
          dto.supportingDocuments.map((doc) => doc.id).filter(Boolean),
        );

        // Delete documents that are not in the updated list
        const docsToDelete = existingDocs
          .filter((doc) => !updatedDocIds.has(doc.id))
          .map((doc) => doc.id);

        if (docsToDelete.length > 0) {
          await tx.supportingDocument.deleteMany({
            where: { id: { in: docsToDelete } },
          });
        }

        // Upsert documents (update if exists, create if new)
        for (const doc of dto.supportingDocuments) {
          if (doc.id && existingDocIds.has(doc.id)) {
            // Update existing document
            await tx.supportingDocument.update({
              where: { id: doc.id },
              data: {
                title: doc.title,
                description: doc.description,
                url: doc.url,
              },
            });
          } else {
            // Create new document
            await tx.supportingDocument.create({
              data: {
                sponsorshipRequestId: id,
                title: doc.title,
                description: doc.description,
                url: doc.url,
              },
            });
          }
        }
      }

      return await tx.sponsorshipRequest.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          targetAmount: dto.targetAmount,
          deadline: dto.deadline,
          orphans: dto.orphans
            ? { set: dto.orphans.map((orphanId) => ({ id: orphanId })) }
            : undefined,
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

  async deleteDraftRequest(
    requestId: string,
  ): Promise<{ message: string; requestId: string }> {
    return await this.prisma.$transaction(async (tx) => {
      const request = await tx.sponsorshipRequest.findUnique({
        where: { id: requestId },
        select: { id: true, status: true },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      if (request.status !== SponsorshipStatus.DRAFT) {
        throw new NotFoundException('Request is not in draft status');
      }

      await Promise.all([
        tx.supportingDocument.deleteMany({
          where: { sponsorshipRequestId: requestId },
        }),
        tx.actionLog.deleteMany({ where: { sponsorshipRequestId: requestId } }),
      ]);

      await tx.sponsorshipRequest.delete({ where: { id: requestId } });

      return {
        message:
          'Sponsorship request and all related documents have been successfully deleted.',
        requestId,
      };
    });
  }

  async publishSponsorshipRequest(
    requestId: string,
    userId: string,
  ): Promise<SponsorshipRequest> {
    return await this.prisma.$transaction(async (prisma) => {
      const existingRequest = await prisma.sponsorshipRequest.findUnique({
        where: { id: requestId },
        select: { status: true },
      });

      if (!existingRequest) {
        throw new Error('Sponsorship request not found');
      }

      const updatedRequest = await prisma.sponsorshipRequest.update({
        where: { id: requestId },
        data: {
          status: SponsorshipStatus.PUBLISHED,
          updatedByUserId: userId,
        },
      });

      await prisma.actionLog.create({
        data: {
          actionType: ActionType.PUBLISH_SPONSORSHIP_REQUEST,
          fromStatus: existingRequest.status,
          toStatus: SponsorshipStatus.PUBLISHED,
          sponsorshipRequestId: requestId,
          createdByUserId: userId,
        },
      });

      return updatedRequest;
    });
  }

  async submitSponsorshipRequest(
    requestId: string,
    userId: string,
  ): Promise<SponsorshipRequest> {
    return await this.prisma.$transaction(async (prisma) => {
      const existingRequest = await prisma.sponsorshipRequest.findUnique({
        where: { id: requestId },
        select: { status: true },
      });

      if (!existingRequest) {
        throw new Error('Sponsorship request not found');
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
          actionType: ActionType.SUBMIT_SPONSORSHIP_REQUEST,
          fromStatus: existingRequest.status,
          toStatus: SponsorshipStatus.PENDING,
          sponsorshipRequestId: requestId,
          createdByUserId: userId,
        },
      });

      return updatedRequest;
    });
  }

  async approveSponsorshipRequest(
    requestId: string,
    userId: string,
  ): Promise<SponsorshipRequest> {
    return await this.prisma.$transaction(async (prisma) => {
      const existingRequest = await prisma.sponsorshipRequest.findUnique({
        where: { id: requestId },
        select: { status: true },
      });

      if (!existingRequest) {
        throw new Error('Sponsorship request not found');
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

  async rejectSponsorshipRequest(
    requestId: string,
    userId: string,
    rejectionReason: string,
  ): Promise<SponsorshipRequest> {
    return await this.prisma.$transaction(async (prisma) => {
      const existingRequest = await prisma.sponsorshipRequest.findUnique({
        where: { id: requestId },
        select: { status: true },
      });

      if (!existingRequest) {
        throw new Error('Sponsorship request not found');
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
          reason: rejectionReason,
          createdByUserId: userId,
        },
      });

      return updatedRequest;
    });
  }

  async closeSponsorshipRequest(
    requestId: string,
    userId: string,
    closeReason: string,
  ): Promise<SponsorshipRequest> {
    return await this.prisma.$transaction(async (prisma) => {
      const existingRequest = await prisma.sponsorshipRequest.findUnique({
        where: { id: requestId },
        select: { status: true },
      });

      if (!existingRequest) {
        throw new Error('Sponsorship request not found');
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

  async getAllSponsorshipRequests() {
    return await this.prisma.sponsorshipRequest.findMany();
  }

  async getMySponsorshipRequests(userId: string) {
    return await this.prisma.sponsorshipRequest.findMany({
      where: {
        createdBy: {
          id: userId,
        },
      },
      include: {
        orphans: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        SupportingDocument: true,
        EditRequest: {
          include: {
            ActionLog: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        ActionLog: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSponsorshipRequestById(id: string) {
    return await this.prisma.sponsorshipRequest.findUnique({
      where: { id },
      include: {
        orphans: true,
        createdBy: true,
        SupportingDocument: true,
        ActionLog: true,
      },
    });
  }

  async deleteSupportingDocument(
    sponsorshipRequestId: string,
    attachmentId: string,
  ) {
    return await this.prisma.supportingDocument.delete({
      where: {
        sponsorshipRequestId: sponsorshipRequestId,
        id: attachmentId,
      },
    });
  }

  async requestSponsorshipRequestEdit(
    sponsorshipRequestId: string,
    dto: RequestSponsorshipRequestEditDto,
    userId: string,
  ) {
    const sponsorshipRequest = await this.prisma.sponsorshipRequest.update({
      where: {
        id: sponsorshipRequestId,
      },
      data: {
        editRequested: true,
      },
      select: {
        title: true,
        description: true,
        targetAmount: true,
        deadline: true,
        SupportingDocument: true,
        status: true,
      },
    });

    const requestOrphans = await this.prisma.sponsorshipRequest.findUnique({
      where: {
        id: sponsorshipRequestId,
      },
      include: {
        orphans: true,
      },
    });

    const orphanIds = requestOrphans.orphans.map((orphan) => orphan.id);

    return await this.prisma.editRequest.create({
      data: {
        sponsorshipRequestId: sponsorshipRequestId,
        current: { ...sponsorshipRequest, orphans: orphanIds },
        edit: JSON.parse(JSON.stringify(dto.edit)),
        status: Status.pending,
        reason: dto.reason,
        createdByUserId: userId,
      },
    });
  }

  async getSponsorshipRequestEditRequests() {
    const editRequests = await this.prisma.editRequest.findMany();
    return editRequests;
  }

  async approveSponsorshipRequestEdit(editRequestId: string) {
    const editRequest = await this.prisma.editRequest.findUnique({
      where: {
        id: editRequestId,
      },
    });

    await this.prisma.editRequest.update({
      where: {
        id: editRequestId,
      },
      data: {
        status: Status.approved,
      },
    });

    const sponsorshipRequestId = editRequest.sponsorshipRequestId;

    await this.prisma.sponsorshipRequest.update({
      where: {
        id: sponsorshipRequestId,
      },
      data: {
        editRequested: false,
      },
    });

    return await this.updateRequest(
      sponsorshipRequestId,
      editRequest.edit as UpdateSponsorshipRequestDto,
    );
  }

  async rejectSponsorshipRequestEdit(
    editRequestId: string,
    userId: string,
    reason: string,
  ) {
    const editRequest = await this.prisma.editRequest.findUnique({
      where: {
        id: editRequestId,
      },
    });

    await this.prisma.actionLog.create({
      data: {
        actionType: ActionType.REJECT_EDIT_REQUEST,
        fromStatus: editRequest.status,
        toStatus: Status.rejected,
        reason: reason,
        editRequestId: editRequest.id,
        createdByUserId: userId,
      },
    });

    await this.prisma.sponsorshipRequest.update({
      where: {
        id: editRequest.sponsorshipRequestId,
      },
      data: {
        editRequested: false,
      },
    });

    return await this.prisma.editRequest.update({
      where: {
        id: editRequestId,
      },
      data: {
        status: Status.rejected,
      },
    });
  }

  async requestSponsorshipRequestPublish(
    sponsorshipRequestId: string,
    userId: string,
    reason: string,
  ) {
    return await this.prisma.publishRequest.create({
      data: {
        reason: reason,
        sponsorshipRequestId: sponsorshipRequestId,
        createdByUserId: userId,
      },
    });
  }

  async getPublishRequests() {
    return await this.prisma.publishRequest.findMany();
  }

  async approvePublishRequest(publishRequestId: string, userId: string) {
    const publishRequest = await this.prisma.publishRequest.update({
      where: {
        id: publishRequestId,
      },
      data: {
        status: Status.approved,
        updatedByUserId: userId,
      },
    });

    await this.prisma.actionLog.create({
      data: {
        publishRequestId: publishRequestId,
        fromStatus: Status.pending,
        toStatus: Status.approved,
        actionType: ActionType.APPROVE_PUBLISH_REQUEST,
        createdByUserId: userId,
      },
    });

    return publishRequest;
  }

  async rejectPublishRequest(
    publishRequestId: string,
    userId: string,
    reason: string,
  ) {
    const publishRequest = this.prisma.publishRequest.update({
      where: {
        id: publishRequestId,
      },
      data: {
        status: Status.rejected,
        updatedByUserId: userId,
      },
    });

    await this.prisma.actionLog.create({
      data: {
        publishRequestId: publishRequestId,
        fromStatus: Status.pending,
        toStatus: Status.rejected,
        actionType: ActionType.REJECT_PUBSLISH_REQUEST,
        reason: reason,
        createdByUserId: userId,
      },
    });

    return publishRequest;
  }
}
