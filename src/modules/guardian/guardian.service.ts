import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UserType } from '../users/types/user.type';

@Injectable()
export class GuardianService {
  constructor(private readonly prisma:PrismaService){}
  create(createGuardianDto: CreateGuardianDto) {
    return 'This action adds a new guardian';
  }

  findAll() {
    return `This action returns all guardian`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guardian`;
  }

  update(id: number, updateGuardianDto: UpdateGuardianDto) {
    return `This action updates a #${id} guardian`;
  }

  remove(id: number) {
    return `This action removes a #${id} guardian`;
  }

  async createOrphanRequest(userId: string, createRequestDto: CreateRequestDto) {
    // Check if the user is an orphan by verifying the orphan relation
    const user = await this.prisma.user.findFirst({
      where: {
        id: createRequestDto.orphanId,
        isDeleted: false, 
        roles: {
          some: {
            roleName: UserType.ORPHAN, 
          },
        },
      },
      include: {
        Orphan: true, 
      },
    });
  
    if (!user || !user.Orphan) {
      throw new NotFoundException(`User with ID '${userId}' is not an orphan`);
    }
  
    // Access the orphan ID from the user object
    const orphanId = user.Orphan[0]?.id;
  
    // Create a new request for the orphan
    const request = await this.prisma.request.create({
      data: {
        status: createRequestDto.status ?? false,
        isApproved: createRequestDto.isApproved ?? false,
        need: createRequestDto.need,
        description: createRequestDto.description,
        amountNeeded: createRequestDto.amountNeeded,
        amountRecieved: createRequestDto.amountRecieved,
        orphan: {
          connect: { id: orphanId },
        },
      },
    });
  
    return request;
  }
  
  
}
