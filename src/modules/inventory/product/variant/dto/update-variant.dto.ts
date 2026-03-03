import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import CreateVarianDto from './create-variant.dto';
import { IsInt, IsOptional } from 'class-validator';

export default class UpdateVariantDto extends PartialType(CreateVarianDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id: number;
}
