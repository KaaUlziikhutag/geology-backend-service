import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetMistakesDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  authorId: number;
}
