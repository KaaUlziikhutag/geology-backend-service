import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateInnerTrainingDto } from './create-inner-training.dto';

export class UpdateInnerTrainingDto extends PartialType(
  CreateInnerTrainingDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
