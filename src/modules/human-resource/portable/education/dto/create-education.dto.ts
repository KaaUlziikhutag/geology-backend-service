import { Type } from 'class-transformer';
import { Education, FileDto } from '../../../../../utils/globalUtils';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  ValidateNested,
} from 'class-validator';

export class CreateEducationDto {
  @IsOptional()
  @IsNumber()
  userId: number; // worker Id

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @IsString()
  schoolName: string; // Сургуулийн нэр

  @IsOptional()
  @IsNumber()
  countryId: number; // Улс

  @IsOptional()
  @IsNumber()
  cityId: number; // Аймаг

  @IsOptional()
  @IsNumber()
  startYear: number; // Элссэн

  @IsOptional()
  @IsNumber()
  endYear: number; // Төгссөн

  @IsOptional()
  @IsString()
  occupation: string; // ажил мэргэжил

  @IsOptional()
  @IsString()
  grade: string; // Дүн

  @IsOptional()
  @IsString()
  diplomNumber: string; // Дипломын дугаар

  @IsOptional()
  @IsNumber()
  isApplicant: number; // одоо суралцаж байга эсэх

  @IsOptional()
  @IsString()
  schoolShortName: string; // Сургуулийн Товч нэр

  @IsOptional()
  @IsEnum(Education)
  education: Education; // Боловсорлын зэрэг
}
