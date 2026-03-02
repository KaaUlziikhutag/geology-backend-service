import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateEmploymentContractDto } from './create-employment.dto';

export class UpdateEmploymentContractDto extends PartialType(
  CreateEmploymentContractDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsBoolean()
  @IsOptional()
  isNotVoid: boolean;
}
