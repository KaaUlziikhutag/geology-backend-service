import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateEthicDto } from './create-ethics.dto';

export class UpdateEthicDto extends PartialType(CreateEthicDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
