import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateLanguageDto } from './create-languages.dto';

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
