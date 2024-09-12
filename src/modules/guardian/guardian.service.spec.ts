import { Test, TestingModule } from '@nestjs/testing';
import { GuardianService } from './guardian.service';

describe('GuardianService', () => {
  let service: GuardianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardianService],
    }).compile();

    service = module.get<GuardianService>(GuardianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
