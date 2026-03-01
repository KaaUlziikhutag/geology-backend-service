import { PartialType } from '@nestjs/mapped-types';
import CreateCustomerDto from './create-customer.dto';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsOptional()
  @IsNumber()
  id: number;
}
