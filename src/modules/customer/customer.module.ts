import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import Customer from './customer.entity';
import { WarehouseModule } from './warehouse/warehouse.module';
import { EbarimtEasyModule } from '../payment/ebarimt/ebarimt-easy/ebarimt-easy.module';
import { EbarimtInquireModule } from '../payment/ebarimt/ebarimt-inquire/ebarimt-inquire.module';

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
