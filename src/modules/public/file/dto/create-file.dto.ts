import { FileDto, FileType } from '../../../../utils/globalUtils';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsEnum,
  IsDefined,
  IsArray,
} from 'class-validator';
export class CreatePublicFileDto {
  @IsOptional()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  mid: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = [];

  @IsOptional()
  @IsString()
  exp: string;

  @IsOptional()
  @IsNumber()
  fileId: number;

  @IsDefined()
  @IsEnum(FileType)
  type: FileType;

  @IsOptional()
  @IsNumber()
  size: number;

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
  @IsBoolean()
  isHideDownload: boolean;

  @IsOptional()
  @IsBoolean()
  isFavourite: boolean;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  author?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;
}
