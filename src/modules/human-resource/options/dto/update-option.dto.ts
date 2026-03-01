import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateOptionDto } from './create-option.dto';

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
