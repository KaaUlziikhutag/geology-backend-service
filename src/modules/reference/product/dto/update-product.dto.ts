import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString } from 'class-validator';

export default class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsString()
  id: string;
}
