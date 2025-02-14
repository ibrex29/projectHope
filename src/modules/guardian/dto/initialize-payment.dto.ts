import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializePaymentDto {
    @ApiProperty({ example: 5000 })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    // @ApiProperty({ example: 'user@example.com' })
    // @IsEmail()
    // @IsNotEmpty()
    // email: string;

    @ApiProperty({ example: 'abc123' })
    @IsString()
    @IsNotEmpty()
    donationId: string;
}
