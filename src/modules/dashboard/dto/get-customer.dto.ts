import { IsEnum, IsOptional } from 'class-validator';
import { CustomerType } from '../../../utils/enum-utils.js';

export default class GetCustomerDto {
  @IsOptional()
  @IsEnum(CustomerType)
  type: CustomerType;
}
