import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateOthersDto } from './create-others.dto';

export class UpdateOthersDto extends PartialType(CreateOthersDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
