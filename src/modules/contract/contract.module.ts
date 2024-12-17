import { Module } from '@nestjs/common';
import Contract from './contract.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractService } from './contract.service.js';
import { ProductModule } from '../product/product.module.js';
import { ContractController } from './contract.controller.js';
import { DiscountModule } from '../reference/discount/discount.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    ProductModule,
    DiscountModule,
  ],
  providers: [ContractService],
  exports: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
