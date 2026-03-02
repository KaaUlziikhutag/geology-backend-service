import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBooleanString } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetPublicGalleryDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  exp: string;

  @IsBooleanString()
  @IsOptional()
  isFavourite: boolean;

  @IsBooleanString()
  @IsOptional()
  isDeleted: boolean;

  @IsString()
  @IsOptional()
  authorId: number;
}
