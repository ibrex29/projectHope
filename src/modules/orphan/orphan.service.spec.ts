import { Test, TestingModule } from '@nestjs/testing';
import { OrphanService } from './orphan.service';

describe('OrphanService', () => {
  let service: OrphanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrphanService],
    }).compile();

    service = module.get<OrphanService>(OrphanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
