import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDirectLostDto } from './create-lost.dto';

export class UpdateDirectLostDto extends PartialType(CreateDirectLostDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
