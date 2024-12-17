import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PaymentDetail from './payment-detail.entity.js';
import { PaymentDetailService } from './payment-detail.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentDetail])],
  providers: [PaymentDetailService],
  exports: [PaymentDetailService],
})
export class PaymentDetailModule {}
