import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateHumanDto } from './create-human.dto';

export class UpdateHumanDto extends PartialType(CreateHumanDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
