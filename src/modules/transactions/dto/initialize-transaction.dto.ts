import { ApiProperty } from '@nestjs/swagger';

export class InitializeTransactionDto {
  @ApiProperty({ type: String, description: 'ID of the sponsorship request' })
  sponsorshipRequestId: string;

  @ApiProperty({ type: Number, description: 'Donation amount in Naira' })
  amount: number;
}
