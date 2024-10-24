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
  import { CreateRequestDto } from '../dto/create-request.dto';
  import { RequestRemovalDto } from '../dto/request-removal.dto';
  import { Public } from 'src/common/constants/routes.constant';
  import { Request as PrismaRequest } from '@prisma/client';
import { RequestService } from '../request.service';
import { User } from 'src/common/decorators/param-decorator/User.decorator';

  
@ApiTags('Request')
@Controller({ path: 'request', version: '1' })
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async createRequest(@Body() createRequestDto: CreateRequestDto,  @User('userId') userId: string,) {
    return this.requestService.createNeedRequest(createRequestDto,userId);
  }

  @Public()
  @Get()
  async getAllRequests() {
    return this.requestService.listAllRequests();
  }

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
