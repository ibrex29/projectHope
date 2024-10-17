import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

// update-donation.dto.ts
export class UpdateDonationDto {
    
    @ApiProperty({
        description: 'The unique identifier of the request to be Donated to',
        example: '123e4567-e89b-12d3-a456-426614174000',
      })
      @IsNotEmpty()
      @IsString()
      requestId: string;
      
      @ApiProperty({
        description: 'Amount of financial support needed.',
        example: 5000,
        required: false,
      })
      @IsOptional()
      @IsNumber()
      amountToDonate: number;

  }
  