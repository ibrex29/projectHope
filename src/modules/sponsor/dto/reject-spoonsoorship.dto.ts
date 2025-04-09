import { ApiProperty } from '@nestjs/swagger';

export class RejectSponsorshipRequestDto {
  @ApiProperty({
    example: 'Insufficient supporting documents.',
    description: 'Reason for rejection',
  })
  reason: string;
}
