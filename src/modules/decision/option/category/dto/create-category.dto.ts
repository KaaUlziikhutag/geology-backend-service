import { DocumentTypes } from '@utils/enum-utils';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsEnum(DocumentTypes)
  documnetType: DocumentTypes;
}
