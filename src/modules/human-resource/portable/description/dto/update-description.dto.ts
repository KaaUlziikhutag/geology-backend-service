import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDescriptionDto } from './create-description.dto';

export class UpdateDescriptionDto extends PartialType(CreateDescriptionDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
