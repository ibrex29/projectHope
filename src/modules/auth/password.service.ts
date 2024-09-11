import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/services/users.service';
import { JwtTokenService } from 'src/common/token/jwt-token.service';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { PrismaService } from 'prisma/prisma.service';
import { SITE_URL } from 'src/common/constants';
import { UserNotFoundException } from '../users/exceptions/UserNotFound.exception';
import { InvalidResetTokenException } from './exceptions/InvalidResetToken.exception';
@Injectable()
export class PasswordService {
  private readonly siteUrl;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private userService: UsersService,
    private jwtTokenService: JwtTokenService,
    private cryptoService: CryptoService,
    private prisma: PrismaService,
    // private redisService: RedisService,
    // @Inject('NOTIFICATION_CLIENT')
    // private readonly notificationClient: ClientProxy,
  ) {
    this.siteUrl = this.configService.get(SITE_URL);
  }

  // async isResetTokenValid(
  //   email: string,
  //   passwordResetToken: string,
  // ): Promise<boolean> {
  //   const isValidToken = await this.validateResetToken(
  //     email,
  //     passwordResetToken,
  //   );
  //   return !!isValidToken;
  // }

  async resetPassword(email: string, newPassword: string) {
    await this.userService.validateUserExists(email);
    return this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
    });
  }

  async changePassword(userId: string, newPassword: string) {
    await this.userService.validateUserExists(userId);
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
    });
  }

  // async requestPasswordReset(email: string): Promise<string> {
  //   const user = await this.userService.findUserByEmail(email);

  //   if (!user) {
  //     throw new UserNotFoundException();
  //   }

  //   const passwordResetToken = await this.generateSecureToken();
  //   await this.saveResetToken(user.email, passwordResetToken);
  //   this.sendResetTokenToUser(user, passwordResetToken);

  //   return passwordResetToken;
  // }

  // async resetPasswordWithToken(
  //   email: string,
  //   passwordResetToken: string,
  //   newPassword: string,
  // ): Promise<void> {
  //   const user = await this.userService.findUserByEmail(email);

  //   if (!user) {
  //     throw new UserNotFoundException();
  //   }

  //   const isValidToken = await this.validateResetToken(
  //     email,
  //     passwordResetToken,
  //   );

  //   if (!isValidToken) {
  //     throw new InvalidResetTokenException();
  //   }

  //   await this.prisma.user.update({
  //     where: {
  //       email: email,
  //     },
  //     data: {
  //       password: await bcrypt.hash(newPassword, 10),
  //     },
  //   });

  //   await this.invalidateResetToken(email);
  // }

  // private async saveResetToken(
  //   email: string,
  //   passwordResetToken: string,
  // ): Promise<void> {
  //   await this.redisService.set(
  //     `passwordResetToken:${email}`,
  //     passwordResetToken,
  //     60 * 60 * 24,
  //   ); // Cache for 24 hours
  //   Logger.log(
  //     passwordResetToken,
  //     `saveResetToken - passwordResetToken:${email}`,
  //   );
  // }

  // private async validateResetToken(
  //   email: string,
  //   passwordResetToken: string,
  // ): Promise<boolean> {
  //   const storedToken = await this.redisService.get(
  //     `passwordResetToken:${email}`,
  //   );
  //   Logger.log(storedToken, `validateResetToken - passwordResetToken:${email}`);
  //   return passwordResetToken === storedToken;
  // }

  // private async invalidateResetToken(email: string): Promise<void> {
  //   await this.redisService.del(`passwordResetToken:${email}`);
  // }

  // private sendResetTokenToUser(user: any, passwordResetToken: string): void {
  //   this.notificationClient.emit(
  //     SEND_PASSWORD_RESET,
  //     new SendPasswordResetEvent(
  //       user.email,
  //       `${this.siteUrl}/reset-password/${passwordResetToken}?email=${user.email}`,
  //     ),
  //   );
  // }

  private async generateSecureToken(): Promise<string> {
    const randomBytes = await this.cryptoService.getRandomBytes(32); // 32 bytes for a secure token
    return randomBytes.toString('hex');
  }
}
