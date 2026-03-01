import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateSoldiersDto } from './create-soldier.dto';

export class UpdateSoldiersDto extends PartialType(CreateSoldiersDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
