import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateCelebratoryDto } from './create-celebratory.dto';

export class UpdateCelebratoryDto extends PartialType(CreateCelebratoryDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
