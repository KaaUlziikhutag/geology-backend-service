import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { OrderState } from '../../../utils/enum-utils.js';

export class CompleteOrderDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @IsEnum(OrderState)
  state: OrderState;
}
