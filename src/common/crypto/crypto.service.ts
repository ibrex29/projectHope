import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  async hashPassword(password: string, saltRounds = 10): Promise<string> {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Compare the provided password with the hashed password
    return bcrypt.compare(password, hashedPassword);
  }

  getRandomBytes(length: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      randomBytes(length, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }
}
