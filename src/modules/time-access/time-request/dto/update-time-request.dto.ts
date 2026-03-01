import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateTimeRequestDto } from './create-time-request.dto';

export class UpdateTimeRequestDto extends PartialType(CreateTimeRequestDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
