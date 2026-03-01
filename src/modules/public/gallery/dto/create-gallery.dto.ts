import { FileDto } from '../../../../utils/globalUtils';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
export class CreatePublicGalleryDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @IsString()
  exp: string;

  @IsOptional()
  @IsString()
  small: string;

  @IsOptional()
  @IsString()
  large: string;

  @IsOptional()
  @IsNumber()
  access: number;

  @IsOptional()
  @IsNumber()
  share: number;

  @IsOptional()
  @IsDateString()
  date: Date;

  @IsOptional()
  @IsBoolean()
  isCommentHide: boolean;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsBoolean()
  isFavourite: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = [];

  @IsOptional()
  @IsNumber()
  galleryId: number;
}
