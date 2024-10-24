import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, Profile, User } from '@prisma/client';
import { RolesPermissionsService } from './roles-permissions.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { RoleNotFoundException } from '../exceptions/RoleNotFound.exception';
import { UserType } from '../types/user.type';
import { PrismaService } from 'prisma/prisma.service';
import { UserAlreadyExistsException } from '../exceptions/UserAlreadyExists.exception';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';
import { CreateProfileDto } from '../dtos/profile/create-user-profile.dto';
import { UpdateUserParams } from '../types';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  async createUser(userDetails: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userDetails.email,
      },
    });

    if (user) {
      throw new UserAlreadyExistsException();
    }

    const roleName = userDetails.role;

    const role = await this.prisma.role.findUnique({
      where: {
        roleName,
      },
    });

    if (!role) {
      throw new RoleNotFoundException(`Role '${roleName}' not found`);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);

    return this.prisma.user.create({
      data: {
        email: userDetails.email,
        password: hashedPassword,
        phoneNumber: userDetails.phoneNumber,
        isActive: true,
        roles: {
          connectOrCreate: {
            where: {
              roleName,
            },
            create: {
              roleName,
            },
          },
        },
        profile: {
          create: {
            firstName: userDetails.profile.firstName,
            middleName: userDetails.profile.middleName || null,
            lastName: userDetails.profile.lastName,
            dateOfBirth: userDetails.profile.dateOfBirth,
          },
        },
      },
    });
  }

  async createEmploymentAndProfile(
    createProfileDto: CreateProfileDto,
    userId: string
  ) {
    // Find the local government by name to get its ID
    const localGovernment = await this.prisma.localGovernment.findFirst({
      where: { name: createProfileDto.localGovernment },
    });
  
    if (!localGovernment) {
      throw new ConflictException('Local government not found');
    }
  
    // Upsert employment details
    const employmentDetails = await this.prisma.employementDetails.upsert({
      where: { userId: userId },
      update: {
        employementStatus: createProfileDto.employementStatus,
        natureOfJob: createProfileDto.natureOfJob,
        annualIncome: createProfileDto.annualIncome,
        employerName: createProfileDto.employerName,
        employerPhoneNumber: createProfileDto.employerPhoneNumber,
        employerAddress: createProfileDto.employerAddress,
      },
      create: {
        employementStatus: createProfileDto.employementStatus,
        natureOfJob: createProfileDto.natureOfJob,
        annualIncome: createProfileDto.annualIncome,
        employerName: createProfileDto.employerName,
        employerPhoneNumber: createProfileDto.employerPhoneNumber,
        employerAddress: createProfileDto.employerAddress,
        user: {
          connect: { id: userId },
        },
      },
    });
  
    // Upsert profile details
    const profile = await this.prisma.profile.upsert({
      where: { userId: userId },
      update: {
        localGovernment: {
          connect: { id: localGovernment.id },
        },
        dateOfBirth: createProfileDto.dateOfBirth,
        homeAddress: createProfileDto.homeAddress,
        maritalStatus: createProfileDto.maritalStatus,
        phoneNumber: createProfileDto.phoneNumber,
        picture: createProfileDto.picture,
      },
      create: {
        localGovernment: {
          connect: { id: localGovernment.id },
        },
        dateOfBirth: createProfileDto.dateOfBirth,
        homeAddress: createProfileDto.homeAddress,
        maritalStatus: createProfileDto.maritalStatus,
        phoneNumber: createProfileDto.phoneNumber,
        picture: createProfileDto.picture,
        user: {
          connect: { id: userId },
        },
      },
    });
  
    // Upsert identity details
    const identity = await this.prisma.identity.upsert({
      where: {
        identityId: {
          name: createProfileDto.name,
          number: createProfileDto.number,
        },
      },
      update: {
        profile: {
          connect: { id: profile.id },
        },
      },
      create: {
        name: createProfileDto.name,
        number: createProfileDto.number,
        profile: {
          connect: { id: profile.id },
        },
      },
    });
  
    return { employmentDetails, profile, identity };
  }
  
  async findUserByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findFirst({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        password: true,
        roles: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        password: true,
        roles: true,
        isActive: true,
      },
    });
  }

  async findUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
        roles: true,
      },
    });
  }

 

  async updateUser(
    userId: string,
    updateUserDetails: UpdateUserParams,
  ): Promise<User> {
    await this.validateUserExists(userId);

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserDetails,
    });
  }

  async deleteUser(userId: string): Promise<User> {
    await this.validateUserExists(userId);

    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  // async createUserProfile(
  //   userId: string,
  //   userProfileDetails: CreateUserProfileParams,
  // ): Promise<Profile> {
  //   await this.validateUserExists(userId);

  //   return this.prisma.profile.create({
  //     data: {
  //       userId,
  //       ...userProfileDetails,
  //     },
  //   });
  // }

  async updateUserProfile(userId: string, data: any): Promise<Profile> {
    await this.validateUserExists(userId);

    return this.prisma.profile.update({
      where: {
        userId,
      },
      data,
    });
  }

  async validateUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  async validateUserEmailExists(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  async updateUserRoles(userId: string, roleNames: string[]): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingRoles = await this.prisma.role.findMany({
      where: { roleName: { in: roleNames } },
    });

    const existingRoleNames = existingRoles.map((role) => role.roleName);
    const nonExistingRoles = roleNames.filter(
      (roleName) => !existingRoleNames.includes(roleName),
    );

    if (nonExistingRoles.length !== 0) {
      throw new NotFoundException(
        'Roles not found ' + nonExistingRoles.join(','),
      );
    }

    // Experimental: Create non-existing roles
    /**const createdRoles = await this.rolesPermissionsService.createRoles(
        nonExistingRoles,
      );
      **/

    // Update user's roles
    const updatedRoles = [...existingRoles];
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: updatedRoles.map((role) => ({ id: role.id })),
        },
      },
    });
  }

  async deleteUserRoles(userId: string, roleNames: string[]): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find roles to disconnect
    const rolesToDisconnect = user.roles.filter((role) =>
      roleNames.includes(role.roleName),
    );

    if (rolesToDisconnect.length === 0) {
      throw new NotFoundException('No matching roles found for deletion');
    }

    // Disconnect roles
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          disconnect: rolesToDisconnect.map((role) => ({ id: role.id })),
        },
      },
    });
  }

  async activateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
      },
    });
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });
  }


  async findAllAdmins() {
    const admins = await this.prisma.user.findMany({
      where: {
        roles: {
          some: {
            roleName: UserType.ADMIN, // Ensure UserType.ADMIN is correctly defined
          },
        },
      },
      include: {
        profile: { 
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
    });
      // Return the admins with their IDs and profile information
    return admins.map(admin => ({
      id: admin.id, 
      profile: admin.profile, 
    }));
  }
}
