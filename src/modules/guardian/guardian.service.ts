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

  
}
