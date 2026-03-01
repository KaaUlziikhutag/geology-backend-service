import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
  IsDateString,
} from 'class-validator';
export class CreateAccessDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  gender: number;

  @IsOptional()
  result?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  appId: number;

  @IsOptional()
  @IsNumber()
  depId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  pos: number;

  @IsOptional()
  @IsString()
  userInfo: string;

  @IsOptional()
  @IsString()
  dayInfo: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsNumber()
  schMin: number;

  @IsOptional()
  @IsNumber()
  workMin: number;

  @IsOptional()
  @IsString()
  time1: string;

  @IsOptional()
  @IsNumber()
  time2: number;

  @IsOptional()
  @IsNumber()
  time3: number;

  @IsOptional()
  @IsNumber()
  time4: number;

  @IsOptional()
  @IsNumber()
  lost1: number;

  @IsOptional()
  @IsNumber()
  lost2: number;

  @IsOptional()
  @IsNumber()
  lost3: number;

  @IsOptional()
  @IsNumber()
  lost4: number;

  @IsOptional()
  @IsNumber()
  lostTime: number;

  @IsOptional()
  @IsNumber()
  lostMoney: number;

  @IsOptional()
  @IsNumber()
  morOvertime: number;

  @IsOptional()
  @IsNumber()
  allowedOvertime: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sdate?: Date;

  @IsOptional()
  @IsNumber()
  isWork: number;

  @IsOptional()
  @IsNumber()
  isState: number;

  @IsOptional()
  @IsNumber()
  mid: number;

  @IsOptional()
  @IsNumber()
  schId: number;

  @IsOptional()
  @IsString()
  dbKey: string;

  @IsOptional()
  @IsNumber()
  incompleteCnt: number;

  @IsOptional()
  @IsNumber()
  absentCnt: number;

  @IsOptional()
  @IsBoolean()
  isSkip?: boolean;
}
