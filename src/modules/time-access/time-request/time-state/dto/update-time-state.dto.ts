import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateTimeStateDto } from './create-time-state.dto';

export class UpdateTimeStateDto extends PartialType(CreateTimeStateDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
