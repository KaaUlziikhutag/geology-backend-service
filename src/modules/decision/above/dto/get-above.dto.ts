import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetAboveDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsString()
  @IsOptional()
  workerId: number;

  @IsString()
  @IsOptional()
  state: number;

  @IsNumberString()
  @IsOptional()
  parentId: number;

  @IsString()
  @IsOptional()
  typeId: number;

  @IsNumberString()
  @IsOptional()
  accessType: number;
}
