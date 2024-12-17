import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDefined, IsNumber, IsOptional } from 'class-validator';

export default class CreateContractDto {
  @ApiProperty()
  @IsDefined()
  @Type(() => Date)
  currentAt: Date;

  @ApiProperty()
  @IsDefined()
  @Type(() => Date)
  endAt: Date;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  customerId: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  attachmentId: number;

  @ApiProperty({ isArray: true, type: 'number'})
  @IsArray()
  @ArrayNotEmpty()
  productIds: number[];

  @ApiProperty({ isArray: true, type: 'number'})
  @IsArray()
  discountIds: number[];
}
