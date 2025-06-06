import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Middle name of the user.',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Smith',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'State of Origin',
    example: 'Kaduna',
  })
  @IsString()
  @IsOptional()
  stateOfOrigin: string;

  @ApiProperty({
    description: 'Local Government Area',
    example: 'Zaria',
  })
  @IsString()
  @IsOptional()
  localGovernment: string;

  @ApiProperty({
    description: 'Date of birth of the user.',
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Home address of the user.',
    example: '123 Main Street',
  })
  @IsString()
  @IsOptional()
  homeAddress?: string;

  @ApiProperty({
    description: 'Marital status of the user.',
    example: 'Single',
  })
  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+123456789',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: "URL to the user's picture.",
    example: 'https://example.com/picture.jpg',
  })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({
    description: 'Employment status of the user (employed, false otherwise).',
    example: 'employed',
  })
  @IsNotEmpty()
  employmentStatus: string;

  @ApiProperty({
    description: 'Nature of the job.',
    example: 'Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  natureOfJob: string;

  @ApiProperty({
    description: 'Annual income of the user.',
    example: '$50,000',
  })
  @IsString()
  @IsNotEmpty()
  annualIncome: string;

  @ApiProperty({
    description: 'Employer name.',
    example: 'Google',
  })
  @IsString()
  @IsNotEmpty()
  employerName: string;

  @ApiProperty({
    description: 'Employer phone number.',
    example: '+123456789',
  })
  @IsString()
  @IsNotEmpty()
  employerPhoneNumber: string;

  @ApiProperty({
    description: 'Employer address.',
    example: '1600 Amphitheatre Parkway, Mountain View, CA',
  })
  @IsString()
  @IsNotEmpty()
  employerAddress: string;

  @ApiProperty({
    description: 'ID Name ',
    example: 'NIN',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID Number ',
    example: '43212302293',
  })
  @IsString()
  @IsNotEmpty()
  number: string;
}
