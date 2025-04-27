import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
export class FetchSponsorshipRequestDto extends PaginationQueryDTO {
  @ApiPropertyOptional({
    example: 'Education',
    description: 'Search sponsorship requests by title or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'PENDING',
    enum: Status,
    description: 'Filter by sponsorship status',
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
