import { IsArray } from 'class-validator';

import { PaginationMetadataDTO } from './page-meta.dto';
import { PaginationQueryDTO } from './pagination-query.dto';

export class PaginationResultDTO<T> {
  @IsArray()
  readonly data: T[];

  readonly meta: PaginationMetadataDTO;

  constructor(
    data: T[],
    itemCount: number,
    options: {
      page: number;
      limit: number;
    },
  ) {
    this.data = data;
    this.meta = new PaginationMetadataDTO({
      itemCount,
      pageOptionsDTO: options as PaginationQueryDTO,
    });
  }
}
