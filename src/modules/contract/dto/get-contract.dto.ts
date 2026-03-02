import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsNumberString,
  IsDate,
  IsBooleanString,
} from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetContractDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsNumberString()
  @IsOptional()
  accessType: number;

  @IsNumberString()
  @IsOptional()
  type: number;

  @IsNumberString()
  @IsOptional()
  typeId: number;

  @IsNumberString()
  @IsOptional()
  parentId: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @IsOptional()
  @IsBooleanString()
  isDraft: boolean; //

  @IsString()
  @IsOptional()
  state: string;
}
