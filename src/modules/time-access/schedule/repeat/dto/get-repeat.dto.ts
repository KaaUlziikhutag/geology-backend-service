import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';
import { Type } from 'class-transformer';

export class GetRepeatDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsString()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  treeId: number;

  @IsString()
  @IsOptional()
  repeatId: number;

  @IsString()
  @IsOptional()
  directId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsBoolean()
  isRegular?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  currentAt: Date;
}
