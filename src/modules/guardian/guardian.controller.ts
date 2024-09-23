import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/role.guard';
import { CreateRequestDto } from './dto/create-request.dto';
import { UserType } from '../users/types/user.type';

// @RolesGuard()
@UseGuards(RolesGuard)
@ApiTags("guardian")
@Controller('guardian')
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Post()
  create(@Body() createGuardianDto: CreateGuardianDto) {
    return this.guardianService.create(createGuardianDto);
  }

  @Get()
  findAll() {
    return this.guardianService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guardianService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuardianDto: UpdateGuardianDto) {
    return this.guardianService.update(+id, updateGuardianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guardianService.remove(+id);
  }

  @Post(':userId')
  // @Role(UserType.ADMIN) // Ensure only users with 'ORPHAN' role can create requests
  async createOrphanRequest(
    @Param('userId') userId: string, 
    @Body() createRequestDto: CreateRequestDto
  ) {
    // Call the service method to handle the business logic
    return await this.guardianService.createOrphanRequest(userId, createRequestDto);
  }
}
