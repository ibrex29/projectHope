import { CreatePermissionDto } from '../dtos/roles-permissions/create-permission.dto';
import { CreateRoleDto } from '../dtos/roles-permissions/create-role.dto';
import { UpdatePermissionDto } from '../dtos/roles-permissions/update-permission.dto';
import { UpdateRoleDto } from '../dtos/roles-permissions/update-role.dto';

export interface IRolesPermissionsService {
  // Role methods
  createRole(createRoleDto: CreateRoleDto): Promise<any>;
  findRoleById(id: string): Promise<any>;
  updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<any>;
  deleteRole(id: string): Promise<void>;

  // Permission methods
  createPermission(createPermissionDto: CreatePermissionDto): Promise<any>;
  findPermissionById(id: string): Promise<any>;
  updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<any>;
  deletePermission(id: string): Promise<void>;
}
