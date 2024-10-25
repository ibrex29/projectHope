import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Version,
  Request,
} from '@nestjs/common';
import { UpdateUserRolesDto } from '../dtos/roles-permissions/update-user-roles.dto';
import { SerializedUser } from '../serializers/user.serializer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';
import { Public } from 'src/common/constants/routes.constant';
import { CreateProfileDto } from '../dtos/profile/create-user-profile.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller({ path: 'user', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post('')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  
  @Post("account-setup")
  async createEmploymentAndProfile(
    @Body() body: CreateProfileDto,
    @Request() req
  ) {
  
    return this.userService.createEmploymentAndProfile(    
      body,
      req.user?.userId
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

  @Post('/:userId/activate')
  async activateUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.userService.activateUser(userId);
  }

  @Post('/:userId/deactivate')
  async deactivateUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.userService.deactivateUser(userId);
  }

  @Delete('/:userId')
  async deleteUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.userService.deleteUser(userId);
  }

}
