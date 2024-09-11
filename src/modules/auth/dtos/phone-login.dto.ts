import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PhoneLoginDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
