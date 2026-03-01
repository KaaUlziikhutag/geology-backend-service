import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateVoteAnswerDto } from './create-answer.dto';

export class UpdateVoteAnswerDto extends PartialType(CreateVoteAnswerDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
