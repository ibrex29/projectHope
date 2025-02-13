import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    Param,
    UseGuards,
    Patch,
    Delete,
  } from '@nestjs/common';
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
  import { RequestRemovalDto } from '../dto/request-removal.dto';
  import { Request as PrismaRequest } from '@prisma/client';
import { RequestService } from '../request.service';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { UpdateNeedDto } from '../dto/need/update-need.dto';
import { CreateNeedDto } from '../dto/need/create-need.dto';
import { CreateRequestDto } from '../dto/create-request.dto';

@ApiBearerAuth()
@ApiTags('Request')
@Controller({ path: 'request', version: '1' })
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  // @Post()
  // async createRequest(@Body() createRequestDto: CreateRequestDto,  @User('userId') userId: string,) {
  //   return this.requestService.createRequest(createRequestDto,userId);
  // }

  // @Public()
  // @Get()
  // async getAllRequests() {
  //   return this.requestService.listAllRequests();
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('deletion-request')
  async removeRequest(@Body() dto: RequestRemovalDto,
  @User('userId') userId: string
): Promise<PrismaRequest> {
  return  this.requestService.needRequestRemoval(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteNeedRequest(@Param('id') requestId: string,  @User('userId') userId: string,){
    return this.requestService.deleteNeedRequest(requestId, userId);
  }

}
@ApiBearerAuth()
@ApiTags('needs mananagement')
@Controller('needs')
export class NeedController {
  constructor(private readonly needService: RequestService) {}

  @Post()
  create(@Body() createNeedDto: CreateNeedDto) {
    return this.needService.create(createNeedDto);
  }

  @Get()
  findAll() {
    return this.needService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.needService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNeedDto: UpdateNeedDto) {
    return this.needService.update(id, updateNeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.needService.remove(id);
  }
}
