import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDTO {
  @ApiProperty({
    description: 'Old Password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  oldPassword: string;

  @ApiProperty({
    description: 'New Password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(3)
  newPassword: string;
}
