import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateVoteQuestionDto {
  @IsOptional()
  @IsNumber()
  voteId?: number;

  @IsOptional()
  @IsNumber()
  forumId?: number;

  @IsOptional()
  @IsString()
  option: string;

  @IsOptional()
  @IsNumber()
  authorId: number;
}
