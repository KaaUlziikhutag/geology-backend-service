import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export default class CreateOrderDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  appointmentId: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  priceId: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber({}, { each: true })
  mineralIds: number[];
}
