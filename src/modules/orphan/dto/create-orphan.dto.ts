// create-orphan.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrphanDto {
  @ApiProperty({
    description: 'Picture URL of the orphan.',
    example: 'http://example.com/picture.jpg',
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({
    description: 'Gender of the orphan.',
    example: 'female',
  })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'First name of the orphan.',
    example: 'Jane',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Middle name of the orphan.',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    description: 'Last name of the orphan.',
    example: 'Smith',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Affidavit of guardianship document URL or reference.',
    example: 'http://example.com/affidavit.pdf',
  })
  @IsString()
  @IsNotEmpty()
  affidavitOfGuardianship: string;

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
    description: 'Date of birth of the orphan.',
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Indicates if the orphan is in school.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isEnrolled?: boolean;

  @ApiProperty({
    description: 'Name of the school the orphan attends.',
    example: 'ABC Primary School',
  })
  @IsOptional()
  @IsString()
  schoolName?: string;

  @ApiProperty({
    description: 'Address of the school.',
    example: '123 School Rd, Hadejia',
  })
  @IsOptional()
  @IsString()
  schoolAddress?: string;

  @ApiProperty({
    description: 'Contact person at the school.',
    example: 'Mrs. Johnson',
  })
  @IsOptional()
  @IsString()
  schoolContactPerson?: string;

  @ApiProperty({
    description: 'Contact phone number of the school.',
    example: '+2348012345678',
  })
  @IsOptional()
  @IsString()
  schoolContactPhone?: string;
}
