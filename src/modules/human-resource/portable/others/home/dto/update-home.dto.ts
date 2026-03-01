import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateHomesDto } from './create-home.dto';

export class UpdateHomesDto extends PartialType(CreateHomesDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
