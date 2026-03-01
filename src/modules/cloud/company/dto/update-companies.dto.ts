import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateCompaniesDto } from './create-companies.dto';

export class UpdateCompaniesDto extends PartialType(CreateCompaniesDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
