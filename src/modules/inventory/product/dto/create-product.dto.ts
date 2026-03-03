import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import CreateVarianDto from '../variant/dto/create-variant.dto';
import { Type } from 'class-transformer';
import { ProductType } from '@utils/enum-utils';
import { RelationIdDto } from '@utils/dto/relation-id.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isFeature: boolean;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  categories: RelationIdDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProductType)
  type: ProductType = ProductType.single;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type == ProductType.single)
  @IsString()
  sku: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type == ProductType.single)
  @IsNumber()
  stock: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type == ProductType.single)
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type == ProductType.single)
  @IsNumber()
  discountPrice: number;

  @ApiPropertyOptional({ type: [RelationIdDto] })
  @ValidateIf((o) => o.type == ProductType.single)
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  attributeValues: RelationIdDto[];

  @ApiPropertyOptional({ type: [CreateVarianDto] })
  @ValidateIf((o) => o.type == ProductType.variable)
  @ValidateNested({ each: true })
  @Type(() => CreateVarianDto)
  variants: CreateVarianDto[];
}
