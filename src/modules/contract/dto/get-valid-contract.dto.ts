import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumberString } from 'class-validator';

export class GetValidContractDto {
  @ApiProperty()
  @IsNumberString()
  customerId: number;

  @ApiProperty()
  @IsArray()
  @IsNumberString({}, { each: true })
  productIds: number[];
}
