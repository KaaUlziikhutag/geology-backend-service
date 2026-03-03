import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export default class GetProductDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  categoryId: number;

  @ApiPropertyOptional({
    type: [String],
    description: 'Comma separated category IDs',
  })
  @IsString()
  @IsOptional()
  categoryIds: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Comma separated brand IDs',
  })
  @IsOptional()
  brandIds: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Comma separated attributeValue IDs',
  })
  @IsOptional()
  attributeValueIds: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mallId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  sale: boolean;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  isFeature: boolean;

  @ApiPropertyOptional({
    'x-enumNames': ['createdAt', 'price', 'discountPrice'],
  })
  @IsIn(['createdAt', 'price', 'discountPrice'])
  @IsOptional()
  sortParam: 'createdAt' | 'price' | 'discountPrice';
}
