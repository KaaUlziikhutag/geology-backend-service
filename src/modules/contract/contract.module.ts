import { Module } from '@nestjs/common';
import Contract from './contract.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractService } from './contract.service';
import { ProductModule } from '../product/product.module';
import { ContractController } from './contract.controller';
import { DiscountModule } from '../reference/discount/discount.module';

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
