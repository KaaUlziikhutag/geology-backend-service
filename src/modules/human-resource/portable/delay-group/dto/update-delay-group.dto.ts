import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDelayGroupDto } from './create-delay-group.dto';

export class UpdateDelayGroupDto extends PartialType(CreateDelayGroupDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
