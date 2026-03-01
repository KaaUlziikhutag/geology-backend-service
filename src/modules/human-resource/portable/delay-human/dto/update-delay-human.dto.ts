import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDelayHumanDto } from './create-delay-human.dto';

export class UpdateDelayHumanDto extends PartialType(CreateDelayHumanDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
