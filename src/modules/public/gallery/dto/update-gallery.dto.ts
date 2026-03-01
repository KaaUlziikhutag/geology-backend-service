import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePublicGalleryDto } from './create-gallery.dto';

export class UpdatePublicGalleryDto extends PartialType(
  CreatePublicGalleryDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
