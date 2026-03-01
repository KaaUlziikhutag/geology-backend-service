import { IsEnum, IsOptional } from 'class-validator';
import { CustomerType } from '../../../utils/enum-utils';

export default class GetCustomerDto {
  @IsOptional()
  @IsEnum(CustomerType)
  type: CustomerType;
}
