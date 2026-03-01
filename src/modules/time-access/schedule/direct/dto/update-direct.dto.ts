import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDirectDto } from './create-direct.dto';

export class UpdateDirectDto extends PartialType(CreateDirectDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
