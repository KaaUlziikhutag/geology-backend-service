import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateNewsLikeDto } from './create-like.dto';

export class UpdateNewsLikeDto extends PartialType(CreateNewsLikeDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
