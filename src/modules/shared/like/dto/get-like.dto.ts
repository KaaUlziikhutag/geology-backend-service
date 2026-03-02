import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetNewsLikeDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  newsId: number;
}
