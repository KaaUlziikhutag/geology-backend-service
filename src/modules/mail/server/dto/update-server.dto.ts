import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateServerDto } from './create-server.dto';

export class UpdateServerDto extends PartialType(CreateServerDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
