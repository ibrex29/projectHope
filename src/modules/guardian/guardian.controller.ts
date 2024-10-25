import { Controller, Get, Post, Body} from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dtos/user/create-user.dto';
import { Public } from 'src/common/constants/routes.constant';

@ApiTags("guardian")
@Controller({ path: 'guardian', version: '1' })
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Public()
  @Post('')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.guardianService.createGuardian(createUserDto);
  }

  @Get()
  async getAllGuardian(){
    return this.guardianService.getAllGuardian();
  }

  
}
