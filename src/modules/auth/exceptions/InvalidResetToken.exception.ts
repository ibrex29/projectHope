import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidResetTokenException extends HttpException {
  constructor(
    message = 'Invalid Password Reset Token',
    status: HttpStatus = HttpStatus.UNAUTHORIZED,
  ) {
    super(message, status);
  }
}
