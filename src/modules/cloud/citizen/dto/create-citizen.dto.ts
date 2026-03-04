import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCitizenDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  nationality: string; // Иргэншил

  @ApiProperty()
  @IsString()
  @IsOptional()
  ethnicity: string; // Яс үндэс

  @ApiProperty()
  @IsString()
  @IsOptional()
  familyName: string; // Ургийн овог

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastname: string; // Овог

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstname: string; // Нэр

  @ApiProperty()
  @IsString()
  @IsOptional()
  regno: string; // РД

  @ApiProperty()
  @IsDate()
  @IsOptional()
  birthDate: Date; // Төрсөн өдөр

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender: string; // Хүйс

  @ApiProperty()
  @IsString()
  @IsOptional()
  birthPlace: string; // Төрсөн газар

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  disabled: boolean; // Хөгжлийн бэрхшээлтэй эсэх

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  phone: string; // Утас

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  homePhone: string; // Гэрийн утас

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string; // Имэйл

  @ApiProperty()
  @IsString()
  @IsOptional()
  occupation: string; // Мэргэжил / ажил эрхлэлт

  @ApiProperty()
  @IsString()
  @IsOptional()
  education: string; // Боловсролын түвшин

  @ApiProperty()
  @IsString()
  @IsOptional()
  drivenLisenseNo: string; // Жолооны үнэмлэхний дугаар

  @ApiProperty()
  @IsString()
  @IsOptional()
  ebarimtNo: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  provinceId: number; // Оршин суугаа аймаг

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  districtId: number; // Оршин суугаа сум, дүүрэг

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  streetId: number; // Оршин суугаа сум, дүүрэг

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string; // Оршин суугаа хаяг

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId: number; // Хэрэглэгчийн дугаар
}
