import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateoccupationDto } from './create-cccupation.dto';

export class UpdateoccupationDto extends PartialType(CreateoccupationDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
