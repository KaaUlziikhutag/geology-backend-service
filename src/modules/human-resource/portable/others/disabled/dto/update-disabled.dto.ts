import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDisabledDto } from './create-disabled.dto';

export class UpdateDisabledDto extends PartialType(CreateDisabledDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
