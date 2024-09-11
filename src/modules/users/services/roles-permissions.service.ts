import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from '../dtos/roles-permissions/create-role.dto';
import { UpdateRoleDto } from '../dtos/roles-permissions/update-role.dto';
import { CreatePermissionDto } from '../dtos/roles-permissions/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/roles-permissions/update-permission.dto';

@Injectable()
export class RolesPermissionsService {
  constructor(private prisma: PrismaService) {}

  // Role related methods

  async createRole(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async createRoles(roleNames: string[]): Promise<Role[]> {
    return Promise.all(
      roleNames.map(async (roleName) => {
        const existingRole = await this.prisma.role.findUnique({
          where: { roleName },
        });

        return existingRole || this.prisma.role.create({ data: { roleName } });
      }),
    );
  }

  async findRoles() {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: true,
      },
    });

    return roles;
  }

  async findRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findRoleById(id);
    return this.prisma.role.update({
      where: {
        id: role.id,
      },
      data: updateRoleDto,
    });
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.findRoleById(id);
    await this.prisma.role.delete({
      where: {
        id: role.id,
      },
    });
  }

  // Permission related methods

  async createPermission(createPermissionDto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async findPermissionById(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id,
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findPermissionById(id);
    return this.prisma.permission.update({
      where: {
        id: permission.id,
      },
      data: updatePermissionDto,
    });
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.findPermissionById(id);
    await this.prisma.permission.delete({
      where: {
        id: permission.id,
      },
    });
  }
}
