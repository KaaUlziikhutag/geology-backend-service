import { IsOptional, IsNumber } from 'class-validator';
export class CreateVoteAnswerDto {
  @IsOptional()
  @IsNumber()
  questionId: number;

  @IsOptional()
  @IsNumber()
  userId: number;
}
