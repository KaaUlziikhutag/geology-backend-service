import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePublicNewsDto } from './create-news.dto';

export class UpdatePublicNewsDto extends PartialType(CreatePublicNewsDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
