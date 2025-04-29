// import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

// export class CreateEmploymentDetailsDto {
//   @ApiProperty({
//     description: 'Employment status of the user (employed, false otherwise).',
//     example: "employed",
//   })
//   @IsBoolean()
//   @IsNotEmpty()
//   employementStatus: string;

//   @ApiProperty({
//     description: 'Nature of the job.',
//     example: 'Software Engineer',
//   })
//   @IsString()
//   @IsNotEmpty()
//   natureOfJob: string;

//   @ApiProperty({
//     description: 'Annual income of the user.',
//     example: '$50,000',
//   })
//   @IsString()
//   @IsNotEmpty()
//   annualIncome: string;

//   @ApiProperty({
//     description: 'Employer name.',
//     example: 'Google',
//   })
//   @IsString()
//   @IsNotEmpty()
//   employerName: string;

//   @ApiProperty({
//     description: 'Employer phone number.',
//     example: '+123456789',
//   })
//   @IsString()
//   @IsNotEmpty()
//   employerPhoneNumber: string;

//   @ApiProperty({
//     description: 'Employer address.',
//     example: '1600 Amphitheatre Parkway, Mountain View, CA',
//   })
//   @IsString()
//   @IsNotEmpty()
//   employerAddress: string;

// }
