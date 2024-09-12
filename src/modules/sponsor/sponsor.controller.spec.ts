import { Test, TestingModule } from '@nestjs/testing';
import { SponsorController } from './sponsor.controller';
import { SponsorService } from './sponsor.service';

describe('SponsorController', () => {
  let controller: SponsorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SponsorController],
      providers: [SponsorService],
    }).compile();

    controller = module.get<SponsorController>(SponsorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
