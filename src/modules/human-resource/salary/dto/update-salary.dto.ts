import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateSalaryDto } from './create-salary.dto';

export class UpdateSalaryDto extends PartialType(CreateSalaryDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
