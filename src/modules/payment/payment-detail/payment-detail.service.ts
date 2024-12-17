import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PaymentDetail from './payment-detail.entity.js';
import { Repository } from 'typeorm';
import CreatePaymentDetailDto from './dto/create-payment-dtl.dto.js';

@Injectable()
export class PaymentDetailService {
  constructor(
    @InjectRepository(PaymentDetail)
    private paymentDtlRepository: Repository<PaymentDetail>,
  ) {}

  async createPaymentDetail(
    paymentDtl: CreatePaymentDetailDto,
  ): Promise<PaymentDetail> {
    const newPaymentDtl = this.paymentDtlRepository.create(paymentDtl);
    return await newPaymentDtl.save();
  }
  async deletePaymentDetail(id: number): Promise<void> {
    const deleteResponse = await this.paymentDtlRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Payment detail with id: ${id} not found`);
    }
  }
}
