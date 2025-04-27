import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDonationDto {
  @ApiProperty({ example: 100.0, description: 'The amount donated' })
  amountDonated: number;

  @ApiPropertyOptional({
    example: 'Helping a child in need',
    description: 'Optional remark about the donation',
  })
  remark?: string;

  @ApiProperty({
    example: [
      'd1234567-89ab-cdef-0123-456789abcdef',
      'e2345678-90bc-def0-1234-56789abcdef0',
    ],
    description:
      'An array of sponsorship request IDs associated with this donation',
    isArray: true,
  })
  sponsorshipRequestIds: string[];
}
