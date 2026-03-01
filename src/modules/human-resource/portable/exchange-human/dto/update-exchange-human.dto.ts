import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateExchangeHumanDto } from './create-exchange-human.dto';

export class UpdateExchangeHumanDto extends PartialType(
  CreateExchangeHumanDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
