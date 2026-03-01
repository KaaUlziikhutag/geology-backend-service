import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePublicFileDto } from './create-file.dto';

export class UpdatePublicFileDto extends PartialType(CreatePublicFileDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
