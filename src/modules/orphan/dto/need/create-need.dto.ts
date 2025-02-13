import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNeedDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  additionalInfo?: Record<string, any>; 

  @IsOptional()
  @IsString()
  supportiveDocuments?: string;
}
