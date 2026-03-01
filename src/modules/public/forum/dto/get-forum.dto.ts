import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetPublicForumDto extends PartialType(PageOptionsDto) {
  @IsNumber()
  @IsOptional()
  authorId: number;
}
