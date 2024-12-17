import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ProductType } from '../../../utils/enum-utils.js';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '../../../utils/dto/page-options.dto.js';

export default class GetPriceDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  sectionId: number;

  @ApiPropertyOptional()
  @IsEnum(ProductType)
  @IsOptional()
  productType: ProductType;

  @ApiPropertyOptional()
  @IsNumberString({}, { each: true })
  @IsOptional()
  productIds: number[];

  @ApiPropertyOptional()
  @IsNumberString({}, { each: true })
  @IsOptional()
  mineralTypeIds: number[];

  @ApiPropertyOptional()
  @IsNumberString({}, { each: true })
  @IsOptional()
  elementIds: number[];

  @ApiPropertyOptional()
  @IsNumberString({}, { each: true })
  @IsOptional()
  technologyIds: number[];
}
