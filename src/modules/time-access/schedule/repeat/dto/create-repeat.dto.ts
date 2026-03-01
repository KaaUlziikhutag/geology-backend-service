import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsDateString,
} from 'class-validator';
import {
  AppointmentStatusType,
  CalculationType,
} from '../../../../../utils/globalUtils';
import RepeatDetails from '../detail/entities/repeat-detail.entity';
export class CreateRepeatDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(AppointmentStatusType)
  status: AppointmentStatusType;

  @IsOptional()
  @IsString()
  closeNote?: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsString()
  startNight: string;

  @IsOptional()
  @IsDateString()
  startDate: Date; // Эхлэх огноо

  @IsOptional()
  @IsDateString()
  endDate: Date; // Эхлэх огноо

  @IsOptional()
  @IsString()
  color: string; // Өнгө

  @IsOptional()
  @IsString()
  endNight: string;

  @IsOptional()
  @IsNumber()
  dayMoney: number;

  @IsOptional()
  @IsNumber()
  confirmId: number;

  @IsOptional()
  @IsNumber()
  halfDayMoney: number;

  @IsOptional()
  @IsEnum(CalculationType)
  workingHours: CalculationType;

  @IsOptional()
  @IsNumber()
  autorId: number;

  @IsOptional()
  detail: RepeatDetails[];

  @IsOptional()
  @IsBoolean()
  isMorning?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelayTime?: boolean;

  @IsOptional()
  @IsNumber()
  startDateHour?: number;

  @IsOptional()
  @IsNumber()
  startDateMinute?: number;

  @IsOptional()
  @IsNumber()
  endDateHour?: number;

  @IsOptional()
  @IsNumber()
  endDateMinute?: number;
}
