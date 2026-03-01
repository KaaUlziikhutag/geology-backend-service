import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateFamilyDto } from './create-family.dto';

export class UpdateFamilyDto extends PartialType(CreateFamilyDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
