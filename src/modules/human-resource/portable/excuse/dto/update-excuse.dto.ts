import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateExcuseDto } from './create-excuse.dto';

export class UpdateExcuseDto extends PartialType(CreateExcuseDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
