import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateMailDto } from './create-mail.dto';

export class UpdateMailDto extends PartialType(CreateMailDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
