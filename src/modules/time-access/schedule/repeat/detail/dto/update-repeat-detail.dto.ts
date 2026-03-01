import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateRepeatDetailDto } from './create-repeat-detail.dto';

export class UpdateRepeatDetailDto extends PartialType(CreateRepeatDetailDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
