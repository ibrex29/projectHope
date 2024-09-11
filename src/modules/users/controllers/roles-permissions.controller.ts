import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Version,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { CreateRoleDto } from '../dtos/roles-permissions/create-role.dto';
import { UpdateRoleDto } from '../dtos/roles-permissions/update-role.dto';
import { CreatePermissionDto } from '../dtos/roles-permissions/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/roles-permissions/update-permission.dto';

@ApiTags('Manage Roles and Permissions')
@ApiBearerAuth()
@Controller('roles-permissions')
export class RolesPermissionsController {
  constructor(
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  // Role endpoints

  @Version('1')
  @Post('roles')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesPermissionsService.createRole(createRoleDto);
  }

  @Version('1')
  @Get('roles/:id')
  findRoleById(@Param('id') id: string) {
    return this.rolesPermissionsService.findRoleById(id);
  }

  @Version('1')
  @UseInterceptors(ClassSerializerInterceptor) // serialize response from endpoint
  @Get('roles')
  listRoles() {
    return this.rolesPermissionsService.findRoles();
  }

  @Version('1')
  @Put('roles/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesPermissionsService.updateRole(id, updateRoleDto);
  }

  @Version('1')
  @Delete('roles/:id')
  deleteRole(@Param('id') id: string): Promise<void> {
    return this.rolesPermissionsService.deleteRole(id);
  }

  // Permission endpoints
  @Version('1')
  @Post('permissions')
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rolesPermissionsService.createPermission(createPermissionDto);
  }

  @Version('1')
  @Get('permissions/:id')
  findPermissionById(@Param('id') id: string) {
    return this.rolesPermissionsService.findPermissionById(id);
  }

  @Version('1')
  @Put('permissions/:id')
  updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.rolesPermissionsService.updatePermission(
      id,
      updatePermissionDto,
    );
  }

  @Version('1')
  @Delete('permissions/:id')
  deletePermission(@Param('id') id: string): Promise<void> {
    return this.rolesPermissionsService.deletePermission(id);
  }
}
