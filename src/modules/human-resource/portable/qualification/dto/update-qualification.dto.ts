import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateQualificationDto } from './create-qualification.dto';

export class UpdateQualificationDto extends PartialType(
  CreateQualificationDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
