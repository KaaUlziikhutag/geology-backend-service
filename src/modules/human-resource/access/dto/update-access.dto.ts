import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAccessDto } from './create-access.dto';

export class UpdateAccessDto extends PartialType(CreateAccessDto) {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsOptional()
  @IsNumber()
  accessType: number;

  @IsOptional()
  @IsNumber()
  accessId: number;
}
