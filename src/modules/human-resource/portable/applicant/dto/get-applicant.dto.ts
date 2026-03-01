import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetApplicantDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsString()
  @IsOptional()
  appId: number;
}
