import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateSupervisorDto } from './create-supervisor.dto';

export class UpdateSupervisorDto extends PartialType(CreateSupervisorDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
