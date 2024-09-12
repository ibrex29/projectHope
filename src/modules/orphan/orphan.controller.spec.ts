import { Test, TestingModule } from '@nestjs/testing';
import { OrphanController } from './orphan.controller';
import { OrphanService } from './orphan.service';

describe('OrphanController', () => {
  let controller: OrphanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrphanController],
      providers: [OrphanService],
    }).compile();

    controller = module.get<OrphanController>(OrphanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
