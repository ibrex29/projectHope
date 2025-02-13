import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationQueryDTO {
  @ApiPropertyOptional({
    enum: Order,
    // description: 'Sort order: ASC for ascending, DESC for descending',
    example: Order.DESC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly sortOrder?: Order = Order.ASC;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    maximum: 50,
    description: 'Number of items per page (default: 10, max: 50)',
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
