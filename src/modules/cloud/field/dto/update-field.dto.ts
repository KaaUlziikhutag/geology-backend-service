import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateFieldDto } from './create-field.dto';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
