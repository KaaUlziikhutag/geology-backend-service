import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetPublicVoteDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  exp: string;

  @IsString()
  @IsOptional()
  authorId: number;
}
