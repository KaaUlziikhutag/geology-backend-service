import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EmployeeType,
  JobAction,
  TemporaryOptions,
  TimeAccessType,
  WorkType,
} from '@utils/enum-utils';
export class CreateWorkerDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  companyId?: number; // company medeelel

  @IsOptional()
  @IsNumber()
  humanId?: number; // relation human id

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsNumber()
  comId?: number;

  @IsOptional()
  @IsNumber()
  depId?: number;

  @IsOptional()
  @IsNumber()
  appId?: number;

  @IsOptional()
  @IsNumber()
  confirmId?: number;

  @IsOptional()
  @IsString()
  comName?: string;

  @IsOptional()
  @IsString()
  depName?: string;

  @IsOptional()
  @IsString()
  appName?: string;

  @IsOptional()
  @IsString()
  systemName?: string;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsNumber()
  isActive?: number;

  @IsOptional()
  @IsEnum(WorkType)
  workerType?: WorkType;

  @IsOptional()
  @IsEnum(EmployeeType)
  employeeType?: EmployeeType; // Албан тушаалын төрөл

  @IsOptional()
  @IsEnum(JobAction)
  jobAction?: JobAction; // Албан тушаалын төрөл

  @IsOptional()
  @IsEnum(TemporaryOptions)
  temporaryOptions?: TemporaryOptions;

  @IsOptional()
  @IsNumber()
  workerTip?: number; // 1:Үгүй 2: Хөгжлийн бэрхшээлтэй

  @IsOptional()
  @IsBoolean()
  isModerator?: boolean;

  @IsOptional()
  @IsBoolean()
  isEditDate?: boolean;

  @IsOptional()
  @IsBoolean()
  isRequest?: boolean; // Хүлээн авсан эсэх

  @IsOptional()
  @IsNumber()
  profileId?: number; // нүүр зургийн id

  @IsOptional()
  @IsString()
  workMail?: string;

  @IsOptional()
  @IsNumber()
  occupationId: number; //

  @IsOptional()
  @IsNumber()
  insuranceId: number; //

  @IsOptional()
  @IsString()
  workPhone?: string;

  @IsOptional()
  @IsString()
  code?: string; // Цаг бүртгэлийн код

  @IsOptional()
  @IsString()
  codeOut?: string;

  @IsOptional()
  @IsString()
  ergonomist?: string;

  @IsOptional()
  @IsNumber()
  timeAccessId?: number; // Цаг бүртгэлийн ID

  @IsOptional()
  @IsEnum(TimeAccessType)
  timeAccessType?: TimeAccessType; // direct','repeat’ - Цаг бүртгэлийн төрөл

  @IsOptional()
  @IsNumber()
  timeAccessMode?: number;

  @IsOptional()
  @IsNumber()
  timeStepId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfEmployment?: Date;
}
