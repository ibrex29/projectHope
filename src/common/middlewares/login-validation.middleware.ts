import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EmailLoginDto } from 'src/modules/auth/dtos/email-login.dto';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const dto = plainToInstance(EmailLoginDto, req.body);

    // Validate the DTO using class-validator
    const errors = await validate(dto, {
      whitelist: true,
    });

    if (errors.length > 0) {
      // Map the validation errors to the desired format
      const validationErrors = errors
        .map((error) => {
          const constraints = Object.values(error.constraints);
          return constraints;
        })
        .flat();

      // Create a custom error response
      const response = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: validationErrors,
        error: 'Bad Request',
      };

      // Return the custom error response
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    next();
  }
}
