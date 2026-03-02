import { DecisionCategory, DecisionType } from '@utils/enum-utils';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
export class CreateTypeDto {
  @IsOptional()
  @IsEnum(DecisionType)
  decisionType: DecisionType;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsEnum(DecisionCategory)
  writingCategory: DecisionCategory;
}
