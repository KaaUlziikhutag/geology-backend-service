import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateItechItemDto } from './create-itech-items.dto';

export class UpdateItechItemDto extends PartialType(CreateItechItemDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
