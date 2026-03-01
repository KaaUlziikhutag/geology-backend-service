import {
  AppointmentCostType,
  AppointmentStatusType,
  CompensationType,
  FileDto,
  RequestType,
  TimeEventType,
  WorkTime,
} from '../../../../utils/globalUtils';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsDateString,
  IsEnum,
} from 'class-validator';
export class CreateTimeRequestDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsEnum(RequestType)
  type: RequestType;

  @IsOptional()
  @IsNumber()
  timeStateId: number;

  @IsOptional()
  @IsBoolean()
  isFullDay?: boolean;

  @IsOptional()
  @IsBoolean()
  isLostTime?: boolean;

  @IsOptional()
  @IsEnum(TimeEventType)
  timeSelection: TimeEventType;

  @IsOptional()
  @IsBoolean()
  isForeignAssignment?: boolean;

  @IsOptional()
  @IsNumber()
  appointmentId: number;

  @IsOptional()
  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsString()
  purpose: string;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsString()
  totalTime: string;

  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;

  @IsOptional()
  @IsNumber()
  totalDays: number;

  @IsOptional()
  @IsNumber()
  workDay: number;

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
  money: string;

  @IsOptional()
  @IsString()
  addressDetails: string;

  @IsOptional()
  @IsEnum(AppointmentStatusType)
  status: AppointmentStatusType;

  @IsOptional()
  @IsEnum(AppointmentCostType)
  cost: AppointmentCostType;

  @IsOptional()
  @IsEnum(WorkTime)
  workTime: WorkTime;

  @IsOptional()
  @IsEnum(CompensationType)
  compensationType: CompensationType;

  @IsOptional()
  @IsString()
  remainingTime: string;

  @IsOptional()
  @IsString()
  transferToSalary: string;

  @IsOptional()
  @IsBoolean()
  isSalary?: boolean;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  confirmId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];
}
