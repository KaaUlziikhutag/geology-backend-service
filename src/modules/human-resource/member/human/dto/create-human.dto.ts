import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderType, MaritalStatus } from '../../../../../utils/globalUtils';
import { ContactDto } from './contact.dto';
export class CreateHumanDto {
  @IsOptional()
  @IsString()
  familyName: string; // Ургийн овог

  @IsOptional()
  @IsString()
  firstName: string; // Эцэг эхийн нэр

  @IsOptional()
  @IsString()
  lastName: string; // Өөрийн нэр

  @IsOptional()
  @IsNumber()
  region?: number; // Иргэншил

  @IsOptional()
  @IsString()
  nation: string; // Яс үндэс

  @IsOptional()
  @IsString()
  socialOrigin?: string;

  @IsOptional()
  @IsNumber()
  birthCountryId?: number; // Төрсөн улс

  @IsOptional()
  @IsNumber()
  birthCityId?: number; // Төрсөн хот

  @IsOptional()
  @IsNumber()
  birthDistrictId?: number; // Төрсөн Сум дүүрэг

  @IsOptional()
  @IsNumber()
  birthCommetteeId?: number; // Баг хороо

  @IsOptional()
  @IsString()
  birthDetailAddress?: string; // Төрсөн Дэлгэрэнгүй хаяг

  @IsOptional()
  @IsEnum(GenderType)
  gender: GenderType; // Хүйс

  @IsOptional()
  @IsNumber()
  disabled?: number; // 1: Хөгжлийн бэрхшээлгүй 2: Хөгжлийн бэрхшээлтэй

  @IsNotEmpty()
  @MaxLength(10)
  @IsString()
  regNumber: string; // Регистерийн дугаар

  @IsOptional()
  @IsString()
  taxpayerNumber?: string; //  татвар төлөгчийн дугаар

  @IsOptional()
  @IsString()
  driveNumber?: string; // Машины дугаар

  @IsOptional()
  @IsString()
  personalMail?: string; // Имэйл хаяг

  @IsOptional()
  @IsString()
  mobile?: string; // Утас

  @IsOptional()
  @IsString()
  mobileOther?: string; // Утас -2

  @IsOptional()
  @IsString()
  homePhone?: string; // Гэрийн утас

  @IsOptional()
  @IsDateString()
  birthDate?: Date; // Төрсөн он сар өдөр

  @IsOptional()
  @IsNumber()
  mcountryId?: number; // Улс

  @IsOptional()
  @IsNumber()
  mCityId?: number; // Хот/ аймаг

  @IsOptional()
  @IsNumber()
  mDistrictId?: number; // Дүүрэг/ сум

  @IsOptional()
  @IsNumber()
  mCommetteeId?: number; // Хороо/ баг

  @IsOptional()
  @IsNumber()
  ncountryId?: number; // Улс

  @IsOptional()
  @IsNumber()
  nCityId?: number; // Хот/ аймаг

  @IsOptional()
  @IsNumber()
  nDistrictId?: number; // Дүүрэг/ сум

  @IsOptional()
  @IsNumber()
  nCommetteeId?: number; // Дүүрэг/ сум

  @IsOptional()
  @IsString()
  codeOut?: string;

  @IsOptional()
  @IsBoolean()
  isHideMobile?: boolean;

  @IsOptional()
  @IsEnum(MaritalStatus)
  married: MaritalStatus; // Гэрэлтийн байдал

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  faceBook: string; // FaceBook

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
