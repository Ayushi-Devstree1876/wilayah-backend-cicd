import { Test, TestingModule } from '@nestjs/testing';
import { WisdomService } from './wisdom.service';

describe('WisdomService', () => {
  let service: WisdomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WisdomService],
    }).compile();

    service = module.get<WisdomService>(WisdomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
