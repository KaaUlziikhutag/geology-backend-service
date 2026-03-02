import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  IsArray,
  ValidateIf,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AppointmentCostType,
  AppointmentStatusType,
  AppointmentType,
  MoneyType,
  WorkType,
} from '@utils/enum-utils';
export class CreateAppointmentDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.officeData !== undefined)
  expenses?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.country_data !== undefined)
  countries?: Record<string, any>;

  @IsOptional()
  @IsEnum(WorkType)
  workerType?: WorkType;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  workerIds?: number[];

  @IsOptional()
  @IsEnum(AppointmentType)
  type: AppointmentType; // Ангилал

  @IsOptional()
  @IsString()
  lecture: string; // зорилго

  @IsOptional()
  @IsEnum(AppointmentCostType)
  cost: AppointmentCostType;

  @IsOptional()
  @IsEnum(AppointmentStatusType)
  status: AppointmentStatusType;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  receiverId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  depId: number;

  @IsOptional()
  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsNumber()
  cityId: number;

  @IsOptional()
  @IsNumber()
  districtId: number;

  @IsOptional()
  @IsNumber()
  committeeId: number;

  @IsOptional()
  @IsString()
  commandNumber: string;

  @IsOptional()
  @IsString()
  authorName: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  point: string;

  @IsOptional()
  @IsNumber()
  expense: number;

  @IsOptional()
  @IsEnum(MoneyType)
  moneyType: MoneyType; // Мөнгөний төрөл

  @IsOptional()
  @IsNumber()
  employee: number;

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
  comeLand: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  closeDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
