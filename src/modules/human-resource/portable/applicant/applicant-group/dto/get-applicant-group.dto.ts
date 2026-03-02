import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetApplicantGroupDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsString()
  @IsOptional()
  userId: number;
}
