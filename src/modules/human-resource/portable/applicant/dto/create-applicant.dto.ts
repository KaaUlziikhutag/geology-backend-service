import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class CreateApplicantDto {
  @IsOptional()
  @IsString()
  dbKey: string;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsString()
  comName: string;

  @IsOptional()
  @IsNumber()
  appId: number;

  @IsOptional()
  @IsString()
  familyName: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  nation: string;

  @IsOptional()
  @IsString()
  socialOrigin: string;

  @IsOptional()
  @IsString()
  birthCountry: string;

  @IsOptional()
  @IsString()
  birthCity: string;

  @IsOptional()
  @IsString()
  birthCommittee: string;

  @IsOptional()
  @IsString()
  photo: string;

  @IsOptional()
  @IsNumber()
  gender: number;

  @IsNotEmpty()
  @MaxLength(10)
  @IsString()
  regNumber: string; // Регистрийн дугаар

  @IsOptional()
  @IsString()
  ndNumber: string;

  @IsOptional()
  @IsString()
  driveNumber: string;

  @IsOptional()
  @IsString()
  personalMail: string;

  @IsOptional()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  mobileOther: string;

  @IsOptional()
  @IsString()
  homePhone: string;

  @IsOptional()
  @IsDate()
  @Transform(() => Date)
  birthDate: Date; // Төрсөн он сар өдөр

  @IsOptional()
  @IsString()
  mCountry: string;

  @IsOptional()
  @IsString()
  mCity: string;

  @IsOptional()
  @IsString()
  mDistrict: string;

  @IsOptional()
  @IsString()
  nCountry: string;

  @IsOptional()
  @IsString()
  nCity: string;

  @IsOptional()
  @IsString()
  nDistrict: string;

  @IsOptional()
  @IsString()
  nCommittee: string;

  @IsOptional()
  @IsString()
  nRegion: string;

  @IsOptional()
  @IsString()
  nStreet: string;

  @IsOptional()
  @IsString()
  nNumber: string;

  @IsOptional()
  @IsBoolean()
  isApplicant: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
