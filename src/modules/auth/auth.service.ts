import { Injectable } from '@nestjs/common';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { JwtTokenService } from 'src/common/token/jwt-token.service';
import { JwtPayload } from './types';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtTokenService: JwtTokenService,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    const isMatch =
      user &&
      (await this.cryptoService.comparePassword(password, user.password));

    if (user && isMatch) {
      // remove password hash from result
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = {
      phoneNumber: user.phoneNumber,
      sub: user.id,
      email: user.email,
      firstName: user.profile?.firstName,
      middleName: user.profile?.middleName,
      lastName: user.profile?.lastName,
      roles: user.roles,
    };
    const tokens = await this.jwtTokenService.generateToken(payload);
    return {
      ...tokens,
      profile: payload,
    };
  }

  async logout(token: string) {
    return this.jwtTokenService.blacklist(token);
  }
}
