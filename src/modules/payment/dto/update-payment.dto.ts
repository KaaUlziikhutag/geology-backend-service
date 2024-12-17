import { PartialType } from '@nestjs/mapped-types';
import CreatePaymentDto from './create-payment.dto.js';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsOptional()
  @IsNumber()
  id: number;
}
