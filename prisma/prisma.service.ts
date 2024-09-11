import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { FetchDTO, PaginationResultDTO } from 'src/common/dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async disconnect() {
    // Ensure that the PrismaClient disconnects from the database when the application is shut down.
    await this.$disconnect();
  }

  async paginate<T>(
    modelName: Prisma.ModelName,
    {
      query,
      where,
      include = {},
      orderBy = undefined,
    }: {
      query: FetchDTO & { sortField?: string };
      where: object;
      include?: object;
      orderBy?: object;
    },
  ): Promise<PaginationResultDTO<T>> {
    const { skip, limit } = query;

    const findOption: {
      skip: number;
      take: number;
      where: object;
      include: object;
      orderBy?: object;
    } = {
      skip,
      take: limit,
      where,
      include,
    };
    if (orderBy) findOption.orderBy = orderBy;

    const [count, rows] = await Promise.all([
      this[modelName].count({ where }),
      this[modelName].findMany(findOption),
    ]);

    return new PaginationResultDTO(rows, count, query);
  }
}

