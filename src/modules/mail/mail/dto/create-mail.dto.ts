import { FileDto } from '../../../../utils/globalUtils';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
export class CreateMailDto {
  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  letter: string;

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = [];

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  msgId: string;

  @IsOptional()
  @IsDateString()
  date: Date;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];
}
