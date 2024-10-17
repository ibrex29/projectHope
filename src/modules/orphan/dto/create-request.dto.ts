import { 
    IsNotEmpty, 
    IsString, 
    IsOptional, 
    IsArray, 
    IsNumber, 
    IsUUID, 
    IsJSON, 
    IsObject
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  

  export class CreateNeedDto {
    @ApiProperty({
      description: 'Name of the need type.',
      example: 'Educational Support',
    })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @IsString({ message: 'Name must be a string' })
    name: string;
  
    @ApiProperty({
      description: 'Description of the need type.',
      example: 'Financial assistance for educational needs.',
      required: false,
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
  
    @ApiProperty({
      description: 'Link to supportive documents.',
      example: 'https://example.com/documents/support.pdf',
      required: false,
    })
    @IsOptional()
    @IsString({ message: 'Supportive documents must be a string' })
    supportiveDocuments?: string;

    @ApiProperty({
        description: 'Additional information required for the need.',
        example: {
          schoolName: 'Example School',
          address: '123 Main St, City, Country'
        },
        required: true,
      })
      @IsNotEmpty({ message: 'Additional info cannot be empty' })
      @IsJSON()
      additionalInfo: {
        schoolName: string;
        address: string;
        // Add more fields as needed
      };
    }
  
  export class CreateRequestDto {
    @ApiProperty({
      description: 'Description of the request for educational support.',
      example: 'Request for educational support for an orphan.',
    })
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @ApiProperty({
      description: 'ID of the orphan this request is associated with.',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsString()
    orphanId: string;
  
    @ApiProperty({
      description: 'List of needs associated with the request.',
      type: [CreateNeedDto],
      required: false,
    })
    @IsOptional()
    @IsArray()
    needs?: CreateNeedDto[];
  
    @ApiProperty({
      description: 'Amount of financial support needed.',
      example: 5000,
      required: false,
    })
    @IsOptional()
    @IsNumber()
    amountNeeded?: number;

    @ApiProperty({
      description: 'Amount of financial support Gotten.',
      example: 2000,
      required: false,
    })
    @IsOptional()
    @IsNumber()
    amountRecieved: number;
  }
  