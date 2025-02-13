import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateSponsorshipRequestDto {
  @ApiProperty({ example: 'Education Sponsorship for Orphans' })
  title: string;

  @ApiProperty({ example: 'Providing financial support for orphaned children to attend school.' })
  description: string;

  @ApiProperty({ example: 50000, description: 'The total amount required for sponsorship.' })
  amountReceived: number;

  @ApiProperty({ example: 50000, description: 'The total amount required for sponsorship.' })
  targetAmount: number;

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', description: 'The deadline for the sponsorship request.' })
  deadline: Date;

  @ApiProperty({ example: ['document1.pdf', 'document2.png'], required: false, description: 'Supporting documents for the request.' })
  supportingDocuments?: string[];

  @ApiProperty({ example: ['orphan1-id', 'orphan2-id'], description: 'List of orphan IDs associated with this sponsorship request.' })
  orphans: string[];
}


export class UpdateSponsorshipRequestDto extends PartialType(CreateSponsorshipRequestDto) {}