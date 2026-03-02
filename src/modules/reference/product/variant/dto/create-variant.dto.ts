import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RelationIdDto } from '@utils/dto/relation-id.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export default class CreateVarianDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sku: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  discountPrice: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  stock: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  attributeValues: RelationIdDto[];
}
