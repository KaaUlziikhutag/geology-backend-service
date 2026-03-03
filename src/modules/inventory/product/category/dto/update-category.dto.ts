import CreateCategoryDto from './create-category.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export default class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsNumber()
  id: number;
}
