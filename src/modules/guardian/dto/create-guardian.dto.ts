import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProfileDto } from '../../users/dtos/profile/create-user-profile.dto';
import { Type } from 'class-transformer';

export class CreateGuardianDto {
  @ApiPropertyOptional({
    description: 'Optional phone number of the user',
    example: '07012345678',
  })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: "Password for the user's account",
    example: 'P@ssw0rd',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: "role for the user's account",
    example: 'guardian',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    description:
      'Email address of the user, required if phone number is not provided',
    example: 'ibrex@gmail.com',
  })
  @ValidateIf((o) => o.email !== undefined || o.phoneNumber === undefined)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Profile information of the user',
    type: CreateProfileDto,
    example: {
      firstName: 'ibrahim',
      middleName: ' ',
      lastName: 'Muhammad',
      dateOfBirth: '1990-01-01T00:00:00.000Z',
    },
  })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsOptional()
  profile?: CreateProfileDto;
}
