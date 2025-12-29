import { Test, TestingModule } from '@nestjs/testing';
import { WisdomController } from './wisdom.controller';
import { WisdomService } from './wisdom.service';

describe('WisdomController', () => {
  let controller: WisdomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WisdomController],
      providers: [WisdomService],
    }).compile();

    controller = module.get<WisdomController>(WisdomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
