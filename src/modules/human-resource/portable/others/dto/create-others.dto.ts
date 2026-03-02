import {
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamType } from '@utils/enum-utils';
export class CreateOthersDto {
  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  workerId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  isExam: number;

  @IsOptional()
  @IsEnum(ExamType)
  examType: ExamType;

  @IsOptional()
  @IsNumber()
  score: number;

  @IsOptional()
  @IsString()
  additionInfoExam: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  examDate: Date;
}
