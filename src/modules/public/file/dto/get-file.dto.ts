import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBooleanString } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetPublicFileDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  type: number;

  @IsString()
  @IsOptional()
  authorId: number;

  @IsString()
  @IsOptional()
  viewUserId: number;

  @IsString()
  @IsOptional()
  share: number;

  @IsString()
  @IsOptional()
  folderId: number;

  @IsBooleanString()
  @IsOptional()
  isDeleted: boolean;

  @IsOptional()
  @IsString()
  fileIds: string;

  @IsBooleanString()
  @IsOptional()
  isFavourite: boolean;
}
