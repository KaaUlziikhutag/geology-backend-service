import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAptitudeDto } from './create-aptitudes.dto';

export class UpdateAptitudeDto extends PartialType(CreateAptitudeDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
