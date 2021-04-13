import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';

xdescribe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  xit('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
