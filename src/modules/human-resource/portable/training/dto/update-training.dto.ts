import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateTrainingDto } from './create-training.dto';

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
