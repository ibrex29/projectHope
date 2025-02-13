import { ApiProperty, PartialType } from '@nestjs/swagger';

export class SupportingDocumentDto {
  @ApiProperty({ example: 'document1.pdf', description: 'The filename of the supporting document.' })
  filename: string;

  @ApiProperty({ example: 'https://example.com/uploads/document1.pdf', description: 'The URL where the document is stored.' })
  fileUrl: string;

  @ApiProperty({ example: 'PDF', description: 'The type of the document (PDF, PNG, DOCX, etc.).' })
  fileType: string;
}

export class CreateSponsorshipRequestDto {
  @ApiProperty({ example: 'Education Sponsorship for Orphans' })
  title: string;

  @ApiProperty({ example: 'Providing financial support for orphaned children to attend school.' })
  description: string;

  @ApiProperty({ example: 50000, description: 'The total amount required for sponsorship.' })
  targetAmount: number;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', description: 'The deadline for the sponsorship request.' })
  deadline: Date;

  @ApiProperty({ 
    type: [SupportingDocumentDto], 
    required: false, 
    description: 'List of supporting documents for the sponsorship request.'
  })
  supportingDocuments?: SupportingDocumentDto[];

  @ApiProperty({ example: ['orphan1-id', 'orphan2-id'], description: 'List of orphan IDs associated with this sponsorship request.' })
  orphans: string[];

}

export class UpdateSponsorshipRequestDto extends PartialType(CreateSponsorshipRequestDto) {}