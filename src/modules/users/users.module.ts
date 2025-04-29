import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RolesPermissionsController } from './controllers/roles-permissions.controller';
import { UsersController } from './controllers/users.controller';
import { RolesPermissionsService } from './services/roles-permissions.service';
import { UsersService } from './services/users.service';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, RolesPermissionsController],
  providers: [
    UsersService,
    RolesPermissionsService,
    PrismaService,
    CryptoService,
  ],
  exports: [UsersService, RolesPermissionsService, CryptoService],
})
export class UsersModule {}
