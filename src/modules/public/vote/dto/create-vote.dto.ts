import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import Trees from '../../../human-resource/tree/tree.entity';
import { CreateVoteQuestionDto } from '../question/dto/create-question.dto';
export class CreatePublicVoteDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  exp: string;

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  trees?: Trees[];

  @IsOptional()
  @IsString()
  youtube: string;

  @IsOptional()
  @IsNumber()
  access: number;

  @IsOptional()
  @IsNumber()
  share: number;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  status: number;

  @IsOptional()
  @IsNumber()
  vote_type: number;

  @IsOptional()
  @IsDateString()
  date: Date; //

  @IsOptional()
  @IsBoolean()
  isCommentHide: boolean;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @ArrayNotEmpty()
  questions: CreateVoteQuestionDto[];

  @IsOptional()
  author?: Record<string, any>;
}
