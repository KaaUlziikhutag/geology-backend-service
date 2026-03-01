import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateSignatureDto } from './create-signature.dto';

export class UpdateSignatureDto extends PartialType(CreateSignatureDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
