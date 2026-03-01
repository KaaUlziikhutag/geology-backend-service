import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetTrainingDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  autorId: number;
}
