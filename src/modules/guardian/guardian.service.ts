import { Injectable } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Injectable()
export class GuardianService {
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
