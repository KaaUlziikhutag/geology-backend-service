import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateContractDto } from './create-contract.dto';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsBoolean()
  @IsOptional()
  isNotVoid: boolean;
}
