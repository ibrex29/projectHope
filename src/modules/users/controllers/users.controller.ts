import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  Version,
  Request,
  UnauthorizedException
} from '@nestjs/common';
import { UpdateUserRolesDto } from '../dtos/roles-permissions/update-user-roles.dto';
import { SerializedUser } from '../serializers/user.serializer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FetchUsersDTO } from '../dtos/user/fetch-user.dto';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
// import { CreateUserProfileDto } from '../dtos/profile/create-user-profile.dto';
import { Public } from 'src/common/constants/routes.constant';
import { CreateProfileDto } from '../dtos/profile/create-user-profile.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Version('1')
  @Post('')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  
  @Post("account-setup")
  async createEmploymentAndProfile(
    @Body() body: CreateProfileDto,
    @Request() req
  ) {
   
    const userId = req.user?.userId;
  
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
  
    return this.userService.createEmploymentAndProfile(    
      body,
      userId
    );
  }
  

  @Version('1')
  @Get('/:userId')
  async getUser(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = await this.userService.findUserById(userId);
    if (user) {
      return new SerializedUser(user);
    } else {
      throw new UserNotFoundException();
    }
  }

  @Version('1')
  @Patch('/:userId/roles')
  async updateUserRoles(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    await this.userService.updateUserRoles(
      userId,
      updateUserRolesDto.roleNames,
    );
  }

  @Version('1')
  @Delete('/:userId/roles')
  async deleteUserRoles(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    await this.userService.deleteUserRoles(
      userId,
      updateUserRolesDto.roleNames,
    );
  }

  @Version('1')
  @Post('/:userId/activate')
  async activateUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.userService.activateUser(userId);
  }

  @Version('1')
  @Post('/:userId/deactivate')
  async deactivateUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.userService.deactivateUser(userId);
  }

  @Version('1')
  @Delete('/:userId')
  async deleteUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.userService.deleteUser(userId);
  }

}
