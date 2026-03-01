import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateProgramDto } from './create-program.dto';

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
