import { IsEnum, IsOptional } from 'class-validator';
import { CustomerType } from '../../../utils/enum-utils.js';

export class GetCustomerDto {
  @IsOptional()
  @IsEnum(CustomerType)
  type: CustomerType;
}
