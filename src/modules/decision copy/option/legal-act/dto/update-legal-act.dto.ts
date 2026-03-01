import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateLegalActDto } from './create-legal-act.dto';

export class UpdateLegalActDto extends PartialType(CreateLegalActDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
