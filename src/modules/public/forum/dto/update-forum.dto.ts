import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePublicForumDto } from './create-forum.dto';

export class UpdatePublicForumDto extends PartialType(CreatePublicForumDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
