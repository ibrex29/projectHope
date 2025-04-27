import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
export class OrphanSnapshotDto {
  @ApiProperty({
    description: "URL to the orphan's picture",
    type: String,
    nullable: true,
  })
  picture?: string | null;

  @ApiProperty({
    description: 'Name of the school the orphan attends',
    type: String,
    nullable: true,
  })
  schoolName?: string | null;

  @ApiProperty({
    description: 'Whether the orphan is currently in school',
    type: Boolean,
    nullable: true,
  })
  schoolStatus?: boolean | null;

  @ApiProperty({
    description: 'Address of the school',
    type: String,
    nullable: true,
  })
  schoolAddress?: string | null;

  @ApiProperty({
    description: 'Name of the school contact person',
    type: String,
    nullable: true,
  })
  schoolContactPerson?: string | null;

  @ApiProperty({
    description: 'Phone number of the school contact person',
    type: String,
    nullable: true,
  })
  schoolContactPhone?: string | null;

  @ApiProperty({
    description:
      'Affidavit of guardianship (probably a file path or encoded data)',
  })
  affidavitOfGuardianship: string;

  @ApiProperty({
    enum: Status,
    description: 'Current status of the orphan record',
  })
  status: Status;
}

export class SponsorshipRequestSnapshotDto {
  @ApiProperty({ description: 'Title of the sponsorship request' })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the sponsorship request',
  })
  description: string;

  @ApiProperty({ description: 'Target amount of funding required' })
  targetAmount: number;

  @ApiProperty({
    description: 'Amount of funding received so far',
    default: 0.0,
  })
  amountReceived: number;

  @ApiProperty({
    description: 'Deadline for the sponsorship request',
    type: String,
    format: 'date-time',
  })
  deadline: Date;

  @ApiProperty({
    description: 'Current status of the sponsorship request',
    enum: Status,
  })
  status: Status;

  @ApiProperty({
    description: 'List of supporting document IDs',
    type: [String],
  })
  supportingDocumentIds: string[];

  @ApiProperty({ description: 'List of associated orphan IDs', type: [String] })
  orphanIds: string[];
}
