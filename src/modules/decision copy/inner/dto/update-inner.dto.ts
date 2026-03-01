import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateInnerDto } from './create-inner.dto';

export class UpdateInnerDto extends PartialType(CreateInnerDto) {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsBoolean()
  @IsOptional()
  isNotVoid: boolean;
}
