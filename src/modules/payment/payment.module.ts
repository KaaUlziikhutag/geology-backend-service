import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Payment from './payment.entity';
import { EbarimtModule } from './ebarimt/ebarimt.module';
import { PaymentService } from './payment.service';
import { OrderModule } from '../order/order.module';
import { CompanyModule } from '../company/company.module';
import { PaymentController } from './payment.controller';
import { PaymentDetailModule } from './payment-detail/payment-detail.module';
import { CustomerModule } from '../customer/customer.module';
import { DiscountModule } from '../reference/discount/discount.module';
import { ContractModule } from '../contract/contract.module';
import { AdditionModule } from '../reference/addition/addition.module';

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
