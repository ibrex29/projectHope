import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidatePasswordResetDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  resetToken: string;
}
