import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/role.guard';

// @RolesGuard()
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
}
