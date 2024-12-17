import { PartialType } from '@nestjs/mapped-types';
import CreateMineralDto from './create-mineral.dto.js';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateMineralDto extends PartialType(CreateMineralDto) {
  @IsOptional()
  @IsNumber()
  id: number;
}
