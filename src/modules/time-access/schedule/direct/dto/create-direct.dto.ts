import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import MainSchedules from '../main-schedule/main-schedule.entity';
import Trees from '../../../../human-resource/tree/tree.entity';
import {
  AppointmentStatusType,
  CalculationType,
} from '../../../../../utils/globalUtils';
import DirectLosts from '../../../shared/lost/lost.entity';
export class CreateDirectDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  closeNote?: string;

  @IsOptional()
  @IsString()
  boundTime: string;

  @IsOptional()
  @IsEnum(AppointmentStatusType)
  status: AppointmentStatusType;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  halfDayMoney: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  userCount: number;

  @IsOptional()
  @IsNumber()
  overTime: number;

  @IsOptional()
  @IsNumber()
  dayMoney: number;

  @IsOptional()
  @IsNumber()
  confirmId: number;

  @IsOptional()
  @IsNumber()
  missClockPolicy: number;

  @IsOptional()
  @IsDateString()
  insertDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;

  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @IsOptional()
  @IsString()
  time2: string;

  @IsOptional()
  @IsString()
  time3: string;

  @IsOptional()
  week: MainSchedules[];

  @IsOptional()
  lost: DirectLosts[];

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = [];

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  trees?: Trees[];

  @IsOptional()
  @IsBoolean()
  isMorning?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelayTime?: boolean;

  @IsOptional()
  @IsBoolean()
  isRegular?: boolean;

  @IsOptional()
  @IsEnum(CalculationType)
  workingHours: CalculationType;
}
