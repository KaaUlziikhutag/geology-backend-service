import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StateType } from '../../../../../utils/globalUtils';
export class CreateAppDeclareDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  autorId: number;

  @IsOptional()
  @IsNumber()
  appId: number;

  @IsOptional()
  @IsNumber()
  cnt: number;

  @IsOptional()
  @IsString()
  appName: string;

  @IsOptional()
  @IsString()
  requirement: string;

  @IsOptional()
  @IsString()
  appRole: string;

  @IsOptional()
  @IsString()
  additionInfo: string;

  @IsOptional()
  @IsEnum(StateType)
  state: StateType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
