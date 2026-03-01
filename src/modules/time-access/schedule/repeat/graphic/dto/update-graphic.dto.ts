import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateGraphicDto } from './create-graphic.dto';

export class UpdateGraphicDto extends PartialType(CreateGraphicDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
