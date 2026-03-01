import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateRepeatDto } from './create-repeat.dto';

export class UpdateRepeatDto extends PartialType(CreateRepeatDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
