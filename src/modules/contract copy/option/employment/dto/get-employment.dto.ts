import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString, IsDate } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';
import { Type } from 'class-transformer';

export class GetEmploymentContractDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsNumberString()
  @IsOptional()
  type: number;

  @IsNumberString()
  @IsOptional()
  typeId: number;

  @IsNumberString()
  @IsOptional()
  accessType: number;

  @IsNumberString()
  @IsOptional()
  parentId: number;

  @IsNumberString()
  @IsOptional()
  workerId: number;

  @IsNumberString()
  @IsOptional()
  state: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;
}
