import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException, Version, HttpException, HttpStatus, } from '@nestjs/common';
import { OrphanService } from './orphan.service';
import { CreateOrphanDto } from './dto/create-orphan.dto';
import { UpdateOrphanDto } from './dto/update-orphan.dto';
import { ApiTags,ApiOperation, ApiResponse, ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/constants/routes.constant';
import { User } from '@prisma/client';
// @Public()
@ApiTags("orphan")
@ApiBearerAuth()
@Controller('orphan')
// @ApiResponse({
//   status: 401,
//   description: 'Unauthorized. User ID is required.',
// })
@ApiResponse({
  status: 201,
  description: 'The orphan has been successfully created.'})
export class OrphanController {
  constructor(private readonly orphanService: OrphanService) {}
  @Version('1')
  @Post("orphan")
  @ApiOperation({ summary: 'Create a new orphan account and associated profile.' })
  
  async createOrphanAccount(
    @Body() createOrphanDto: CreateOrphanDto,
    @Request() req
  ) { 
    
    const userId = req.user?.userId;
  
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
  
      return await this.orphanService.createOrphanAccount(createOrphanDto,userId);
    } 
@Public()
    @Get('users-with-orphan-role')
    @ApiResponse({ status: 200, description: 'Get users with orphan role successfully.'})
    @ApiResponse({ status: 500, description: 'Error fetching users with orphan role.' })
    async getUsersWithOrphanRole(): Promise<User[]> {
      try {
        return await this.orphanService.getOrphans();
      } catch (error) {
        throw new HttpException(`Error fetching users with orphan role: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
  @Get()
  findAll() {
    return this.orphanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orphanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrphanDto: UpdateOrphanDto) {
    return this.orphanService.update(+id, updateOrphanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orphanService.remove(+id);
  }
}
