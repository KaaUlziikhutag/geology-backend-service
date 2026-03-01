import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { OrderState } from '../../../utils/enum-utils';

export class CompleteOrderDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @IsEnum(OrderState)
  state: OrderState;
}
