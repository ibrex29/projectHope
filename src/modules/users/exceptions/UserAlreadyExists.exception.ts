import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(
    message = 'User Already Exists',
    status: HttpStatus = HttpStatus.CONFLICT,
  ) {
    super(message, status);
  }
}
