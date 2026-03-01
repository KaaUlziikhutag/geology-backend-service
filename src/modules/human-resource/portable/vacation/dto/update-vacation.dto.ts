import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateVacationDto } from './create-vacation.dto';

export class UpdateVacationDto extends PartialType(CreateVacationDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
