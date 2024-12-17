import { IsNumberString, IsOptional } from 'class-validator';

export default class GetPaymentDto {
  @IsNumberString()
  @IsOptional()
  customerId?: number;
}
