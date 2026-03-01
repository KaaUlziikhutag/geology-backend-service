import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateItechDto } from './create-itech.dto';

export class UpdateItechDto extends PartialType(CreateItechDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
