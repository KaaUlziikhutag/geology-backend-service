import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateSocialsDto } from './create-socials.dto';

export class UpdateSocialsDto extends PartialType(CreateSocialsDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
