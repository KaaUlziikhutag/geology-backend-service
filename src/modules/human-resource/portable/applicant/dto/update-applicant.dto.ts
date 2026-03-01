import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateApplicantDto } from './create-applicant.dto';

export class UpdateApplicantDto extends PartialType(CreateApplicantDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
