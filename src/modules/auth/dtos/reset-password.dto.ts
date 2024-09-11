import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordResetDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  resetToken: string;
}
