import { IsString, IsOptional, IsDate, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetHumanResourceDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  systemName: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  workMail: string;

  @IsString()
  @IsOptional()
  regNumber: string;

  @IsOptional()
  @IsString()
  ids: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @IsString()
  @IsOptional()
  filter: string;

  @IsString()
  @IsOptional()
  workerType: string;

  @IsString()
  @IsOptional()
  typeOfPosition: string;

  @IsString()
  @IsOptional()
  employeeType: string;

  @IsNumberString()
  @IsOptional()
  accessType: number;

  @IsNumberString()
  @IsOptional()
  workerTypeOne: number;

  @IsOptional()
  @IsString()
  taxpayerNumber?: string; //  татвар төлөгчийн дугаар

  @IsString()
  @IsOptional()
  depId: number;

  @IsString()
  @IsOptional()
  isActive: number;

  @IsString()
  @IsOptional()
  groupId: number;

  @IsString()
  @IsOptional()
  appId: number;

  @IsString()
  @IsOptional()
  workerId: number;

  @IsString()
  @IsOptional()
  comId: number;
}
