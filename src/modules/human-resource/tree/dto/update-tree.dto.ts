import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateTreeDto } from './create-tree.dto';

export class UpdateTreeDto extends PartialType(CreateTreeDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
