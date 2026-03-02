import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNumber, IsOptional } from 'class-validator';

export default class GetCategoryDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  categoryId?: number = null;

  @ApiProperty()
  // @IsString({ each: true })
  @IsOptional()
  categoryIds?: number[];

  @ApiProperty()
  @IsBooleanString()
  @IsOptional()
  isFeature?: boolean;
}
