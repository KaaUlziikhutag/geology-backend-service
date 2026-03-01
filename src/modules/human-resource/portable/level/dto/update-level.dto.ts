import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateLevelDto } from './create-level.dto';

export class UpdateLevelDto extends PartialType(CreateLevelDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
