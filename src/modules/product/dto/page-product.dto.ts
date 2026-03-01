import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../utils/dto/page-options.dto';
import { ProductType, TaxType } from '../../../utils/enum-utils';
import { ApiPropertyOptional } from '@nestjs/swagger';

export default class PageProductDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  classificationId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  sectionId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TaxType)
  taxType: TaxType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProductType)
  type: ProductType;
}
