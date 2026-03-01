import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateContractDto } from './create-contracts.dto';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
