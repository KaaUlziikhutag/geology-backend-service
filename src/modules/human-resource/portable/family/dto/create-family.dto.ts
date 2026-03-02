import {
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContactPersonStatus, JobTypeStatus } from '@utils/enum-utils';
export class CreateFamilyDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsEnum(ContactPersonStatus)
  whoIs: ContactPersonStatus; // Таны хэн болох

  @IsOptional()
  @IsString()
  lName: string; // Овог

  @IsOptional()
  @IsString()
  fName: string; // Нэр

  @IsOptional()
  @IsEnum(JobTypeStatus)
  jobType: JobTypeStatus; // Ажлын төрөл

  @IsOptional()
  @IsString()
  desc: string; // Тайлбар

  @IsOptional()
  @IsString()
  jobName: string; // Ажлын нэр

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  occupation: string; // Ажил мэргэжил

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate: Date; // Төрсөн он сар өдөр

  @IsOptional()
  @IsNumber()
  birthCountryId: number; // Төрсөн улс

  @IsOptional()
  @IsNumber()
  birthCityId: number; // Төрсөн аймаг хот

  @IsOptional()
  @IsNumber()
  birthDistrictId: number; // Төрсөн сум дүүрэг

  @IsOptional()
  @IsNumber()
  liveCountryId: number; // Амьдарч байгаа улс

  @IsOptional()
  @IsNumber()
  liveCityId: number; // Амьдарч байгаа аймаг хот

  @IsOptional()
  @IsNumber()
  liveDistrictId: number; // Амьдарч байгаа сум дүүрэг

  @IsOptional()
  @IsString()
  detailAddress: string; // Нэмэлт тайлбар
}
