// src/dto/request-removal.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrphanRemovalDto {
  @ApiProperty({
    description: 'The unique identifier of the orphan to be removed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  orphanId: string;

  @ApiProperty({
    description: 'The reason for deleting the orphan',
    example:
      'The orphan does not meet the necessary requirements for approval.',
  })
  @IsNotEmpty()
  @IsString()
  deletionReason: string;
}
