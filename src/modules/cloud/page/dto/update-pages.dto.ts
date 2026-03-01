import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePagesDto } from './create-pages.dto';

export class UpdatePagesDto extends PartialType(CreatePagesDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
