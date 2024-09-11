import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistsException extends HttpException {
  constructor(msg?: string, status?: HttpStatus) {
    super(msg || 'Already Exists', status || HttpStatus.CONFLICT);
  }
}
