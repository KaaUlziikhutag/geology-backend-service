import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Payment from './payment.entity.js';
import { EbarimtModule } from './ebarimt/ebarimt.module.js';
import { PaymentService } from './payment.service.js';
import { OrderModule } from '../order/order.module.js';
import { CompanyModule } from '../company/company.module.js';
import { PaymentController } from './payment.controller.js';
import { PaymentDetailModule } from './payment-detail/payment-detail.module.js';
import { CustomerModule } from '../customer/customer.module.js';
import { DiscountModule } from '../reference/discount/discount.module.js';
import { ContractModule } from '../contract/contract.module.js';
import { AdditionModule } from '../reference/addition/addition.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    EbarimtModule,
    PaymentDetailModule,
    OrderModule,
    CompanyModule,
    CustomerModule,
    DiscountModule,
    ContractModule,
    AdditionModule,
  ],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
