import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateVoteQuestionDto } from './create-question.dto';

export class UpdateVoteQuestionDto extends PartialType(CreateVoteQuestionDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
