import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAwardDto } from './create-awards.dto';

export class UpdateAwardDto extends PartialType(CreateAwardDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
