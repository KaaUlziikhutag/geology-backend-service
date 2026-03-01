import { PartialType } from '@nestjs/swagger';
import CreateContractDto from './create-contract.dto';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
