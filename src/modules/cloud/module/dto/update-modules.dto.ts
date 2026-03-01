import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateModuleDto } from './create-modules.dto';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
