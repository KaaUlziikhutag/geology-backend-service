import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString, IsDate } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetInnerDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsString()
  @IsOptional()
  typeId: number;

  @IsString()
  @IsOptional()
  authorId: number;

  @IsNumberString()
  @IsOptional()
  accessType: number;

  @IsString()
  @IsOptional()
  state: number;

  @IsString()
  @IsOptional()
  workerId: number;

  @IsNumberString()
  @IsOptional()
  type: number;

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
}
