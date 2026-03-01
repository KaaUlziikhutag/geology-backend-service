import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateSystemMailDto } from './create-system-mail.dto';

export class UpdateSystemMailDto extends PartialType(CreateSystemMailDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
