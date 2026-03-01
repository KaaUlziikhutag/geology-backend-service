import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetVoteAnswerDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  questionId: number;

  @IsString()
  @IsOptional()
  userId: number;
}
