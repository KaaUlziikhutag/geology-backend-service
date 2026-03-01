import Trees from '../../../human-resource/tree/tree.entity';
import { CreateVoteQuestionDto } from '../../../public/vote/question/dto/create-question.dto';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
export class CreatePublicForumDto {
  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  trees?: Trees[];

  @IsOptional()
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  description: string;

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
  @IsDateString()
  date: Date; //

  @IsOptional()
  @IsBoolean()
  isCommentHide: boolean;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  author?: Record<string, any>;

  @IsOptional()
  @ArrayNotEmpty()
  questions: CreateVoteQuestionDto[];
}
