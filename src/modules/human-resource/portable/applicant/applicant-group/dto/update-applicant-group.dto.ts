import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateApplicantGroupDto } from './create-applicant-group.dto';

export class UpdateApplicantGroupDto extends PartialType(
  CreateApplicantGroupDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
