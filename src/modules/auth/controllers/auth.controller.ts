import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotImplementedException,
  Patch,
  Post,
  Request,
  UseGuards,
  Version,
} from '@nestjs/common';

import { PasswordService } from '../password.service';
import { PasswordResetDto } from '../dtos/reset-password.dto';
import { ValidatePasswordResetDto } from '../dtos/validate-reset-password.dto';
import { EmailLoginDto } from '../dtos/email-login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePasswordDTO } from '../dtos/change-password.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { Public } from 'src/common/constants/routes.constant';
import { AuthService } from '../auth.service';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
  ) {}

  @Public()
  @Version('1')
  @Post('login/email')
  @UseGuards(LocalAuthGuard)
  async emailLogin(@Request() req, @Body() emailLogin: EmailLoginDto) {
    return this.authService.login(req.user);
  }

  // @Public()
  // @Version('1')
  // @Post('login/phone')
  // @UseGuards(LocalAuthGuard)
  // async phoneLogin(@Request() req) {
  //   throw new NotImplementedException();
  // }

  @Version('1')
  @Get('session')
  getSession(@Request() req) {
    return req.user;
  }

  @Version('1')
  @Post('refresh-token')
  refresh(@Request() req) {
    return true;
  }

  @Version('1')
  @Post('logout')
  async logout(@Headers('authorization') authorizationHeader: string) {
    const accessToken = authorizationHeader.split(' ')[1]; // Extract the token

    // Add the token to the blacklist
    await this.authService.logout(accessToken);

    // Respond with a success message
    return { message: 'Logged out successfully' };
  }

  // @Public()
  // @Version('1')
  // @Post('password/request-reset/')
  // async requestPasswordReset(
  //   @Body() requestPasswordResetDto: RequestPasswordResetDto,
  // ): Promise<string> {
  //   await this.passwordService.requestPasswordReset(
  //     requestPasswordResetDto.email,
  //   );
  //   return `Password reset requested successfully`;
  // }

  // @Public()
  // @Version('1')
  // @Patch('password/reset')
  // async resetPassword(
  //   @Body() passwordResetDto: PasswordResetDto,
  // ): Promise<void> {
  //   await this.passwordService.resetPasswordWithToken(
  //     passwordResetDto.email,
  //     passwordResetDto.resetToken,
  //     passwordResetDto.newPassword,
  //   );
  // }

  // @Public()
  // @Version('1')
  // @Post('password/validate-token')
  // async validatePasswordResetToken(
  //   @Body() validatePasswordResetDto: ValidatePasswordResetDto,
  // ) {
  //   const isTokenValid = await this.passwordService.isResetTokenValid(
  //     validatePasswordResetDto.email,
  //     validatePasswordResetDto.resetToken,
  //   );

  //   if (isTokenValid) {
  //     return { status: 'success', message: 'Reset token is valid.' };
  //   } else {
  //     throw new BadRequestException({
  //       status: 'error',
  //       message: 'Reset token is invalid.',
  //     });
  //   }
  // }

  @Version('1')
  @Post('password/change')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 201,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password',
  })
  async changePassword(
    @User('userId') userId: string,
    @User('email') email: string,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ): Promise<any> {
    const passwordValid = await this.authService.validateUser(
      email,
      changePasswordDTO.oldPassword,
    );

    if (!!passwordValid) {
      await this.passwordService.changePassword(
        userId,
        changePasswordDTO.newPassword,
      );

      return {
        status: 'success',
        message: 'Password changed successfully',
      };
    } else {
      throw new BadRequestException({
        status: 'error',
        message: 'Invalid Password',
      });
    }
  }
}
