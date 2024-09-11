import { PaginationQueryDTO } from './pagination-query.dto';

export interface PageMetaDTOParameters {
  pageOptionsDTO: PaginationQueryDTO;
  itemCount: number;
}

export class PaginationMetadataDTO {
  readonly page: number;

  readonly limit: number;

  readonly itemCount: number;

  readonly pageCount: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor({ pageOptionsDTO, itemCount }: PageMetaDTOParameters) {
    this.page = pageOptionsDTO.page;
    this.limit = pageOptionsDTO.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
