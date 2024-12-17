import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreatePaymentDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  customerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  contractId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discountId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  additionId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({ isArray: true, type: 'number' })
  @IsDefined()
  @IsNumber({}, { each: true })
  orderIds: number[];
}
