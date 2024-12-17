import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service.js';
import { CustomerController } from './customer.controller.js';
import Customer from './customer.entity.js';
import { WarehouseModule } from './warehouse/warehouse.module.js';
import { EbarimtEasyModule } from '../payment/ebarimt/ebarimt-easy/ebarimt-easy.module.js';
import { EbarimtInquireModule } from '../payment/ebarimt/ebarimt-inquire/ebarimt-inquire.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    WarehouseModule,
    EbarimtEasyModule,
    EbarimtInquireModule,
  ],
  providers: [CustomerService],
  exports: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
