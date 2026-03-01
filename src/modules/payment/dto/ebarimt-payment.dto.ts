import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { EbarimtTaxType } from '../../../utils/enum-utils';

export default class EbarimtPaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EbarimtTaxType)
  type: EbarimtTaxType;
}
