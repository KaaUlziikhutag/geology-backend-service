import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ProductType } from '../../../utils/enum-utils.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export default class GetProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString({}, { each: true })
  ids: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  sectionId?: number;
}
