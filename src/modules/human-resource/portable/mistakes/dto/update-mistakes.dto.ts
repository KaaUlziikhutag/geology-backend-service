import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateMistakesDto } from './create-mistakes.dto';

export class UpdateMistakesDto extends PartialType(CreateMistakesDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
