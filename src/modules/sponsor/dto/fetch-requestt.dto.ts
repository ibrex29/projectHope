import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { SponsorshipStatus } from 'src/modules/guardian/dto/types.enum';
export class FetchSponsorshipRequestDto extends PaginationQueryDTO {
  @ApiPropertyOptional({ example: 'Education', description: 'Search sponsorship requests by title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'PENDING', enum: SponsorshipStatus, description: 'Filter by sponsorship status' })
  @IsOptional()
  @IsEnum(SponsorshipStatus)
  status?: SponsorshipStatus;
}
