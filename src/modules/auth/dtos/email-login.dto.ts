import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailLoginDto {
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'ibrex@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'P@ssw0rd',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
