import { Type } from 'class-transformer';
import {
  ContactPersonStatus,
  JobTypeStatus,
} from '../../../../../utils/enumUtils';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDate,
} from 'class-validator';
export class CreateContactDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  lastName: string; // Овог

  @IsOptional()
  @IsString()
  firstName: string; // Нэр

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate: Date; // Төрсөн он сар өдөр

  @IsOptional()
  @IsEnum(ContactPersonStatus)
  whoIs: ContactPersonStatus; // Таны хэн болох

  @IsOptional()
  @IsEnum(JobTypeStatus)
  jobType: JobTypeStatus; // Ажлын эрхлэлт

  @IsOptional()
  @IsString()
  workplace: string; // ажлын газрын нэр

  @IsOptional()
  @IsString()
  work: string; // Ажил Албан тушаал

  // @IsOptional()
  // @IsString()
  // profession: string; // Мэргэжил

  @IsOptional()
  @IsString()
  phone: string; // Утас
}
