// src/dto/request-removal.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestRemovalDto {
  @ApiProperty({
    description: 'The unique identifier of the request to be removed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty({
    description: 'The reason for rejecting the request',
    example:
      'The request does not meet the necessary requirements for approval.',
  })
  @IsNotEmpty()
  @IsString()
  rejectionReason: string;
}
