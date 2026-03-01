import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PaymentDetail from './payment-detail.entity';
import { PaymentDetailService } from './payment-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentDetail])],
  providers: [PaymentDetailService],
  exports: [PaymentDetailService],
})
export class PaymentDetailModule {}
