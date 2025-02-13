import { 
  IsArray, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'The title of the request.',
    example: 'Sponsorship Request for Educational Needs',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the request.',
    example: 'Financial assistance for educational needs.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Type of need associated with the request.',
    example: 'Educational',
  })
  @IsNotEmpty()
  @IsString()
  type: string; 

  @ApiProperty({
    description: 'Array of URLs for supporting pictures.',
    example: ['https://example.com/pic1.jpg', 'https://example.com/pic2.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportingPictures?: string[]; 

  @ApiProperty({
    description: 'Array of URLs for supporting documents.',
    example: ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportingDocuments?: string[]; 

  @ApiProperty({
    description: 'ID of the associated need.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  needId: string; 

  @ApiProperty({
    description: 'Array of IDs of orphans associated with the request.',
    example: ['orphan1-id', 'orphan2-id'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  orphanIds: string[]; 

  @ApiProperty({
    description: 'Amount of financial support needed.',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Amount needed must be a number' })
  amountNeeded?: number;

  @ApiProperty({
    description: 'Amount of financial support already received.',
    example: 2000,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Amount received must be a number' })
  amountRecieved?: number;
}
