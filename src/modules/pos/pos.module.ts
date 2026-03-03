import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { PriceModule } from '../price/price.module';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { BarcodeModule } from '../barcode/barcode.module';

@Module({
  imports: [
    CustomerModule,
    PriceModule,
    OrderModule,
    PaymentModule,
    BarcodeModule,
  ],
})
export class PosModule {}
