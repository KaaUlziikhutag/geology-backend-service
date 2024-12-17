import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  EbarimtPaymentCode,
  PaymentStatus,
} from '../../../../utils/enum-utils.js';

export default class CreatePaymentDetailDto {
  @IsNumber()
  paymentId: number;

  @IsEnum(EbarimtPaymentCode)
  code: EbarimtPaymentCode;

  @IsString()
  @IsOptional()
  exchangeCode: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNumber()
  paidAmount: number;
}
