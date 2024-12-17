import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export default class GetDiscountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  ids?: number[];
}
