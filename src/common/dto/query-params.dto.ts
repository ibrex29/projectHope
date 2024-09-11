import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDTO } from './pagination-query.dto';

export class FetchDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  search?: string;
}
