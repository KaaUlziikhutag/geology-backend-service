import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export class CreateAnalystOrderDto {
  @ApiProperty({ description: 'Дээж ID' })
  @IsNumber()
  mineralId: number;

  @ApiProperty({ description: 'Үнэ ID' })
  @IsDefined()
  @IsNumber()
  priceId: number;
}
