import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateInsuranceTypeDto } from './create-insurance-type.dto';

export class UpdateInsuranceTypeDto extends PartialType(
  CreateInsuranceTypeDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
