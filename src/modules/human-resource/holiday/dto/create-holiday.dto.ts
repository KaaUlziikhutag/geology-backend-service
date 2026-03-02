import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AppointmentStatusType,
  HolidayState,
  WorkType,
} from '@utils/enum-utils';
export class CreateHolidayDto {
  @IsOptional()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  treeId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsEnum(HolidayState)
  state: HolidayState;

  @IsOptional()
  @IsEnum(AppointmentStatusType)
  holidayType: AppointmentStatusType;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.country_data !== undefined)
  countries?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  vacId: number;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  userCode: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  workDay: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  confirmDate: Date;

  @IsOptional()
  @IsNumber()
  confirmId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDay: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDay: Date;

  @IsOptional()
  @IsBoolean()
  isMulti: boolean;

  @IsOptional()
  @IsString()
  closeNote: string;

  @IsOptional()
  @IsNumber()
  holderId: number;

  @IsOptional()
  @IsString()
  holderUserName: string;

  @IsOptional()
  @IsString()
  holderAppName: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  authorName: string;

  @IsOptional()
  @IsBoolean()
  holderRead: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  closeDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTime: Date;

  @IsOptional()
  @IsArray()
  workerIds?: number[];

  @IsOptional()
  @IsEnum(WorkType)
  workerType?: WorkType;

  @IsOptional()
  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsNumber()
  cityId: number;

  @IsOptional()
  @IsNumber()
  districtId: number;
}
