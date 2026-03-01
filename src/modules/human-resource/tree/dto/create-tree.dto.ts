import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDate,
} from 'class-validator';
import {
  DepartmentType,
  Situation,
  TypeOfPosition,
  TypeStatus,
} from '../../../../utils/globalUtils';
import { Type } from 'class-transformer';
export class CreateTreeDto {
  @IsOptional()
  @IsNumber()
  mid: number; // tree id

  @IsOptional()
  @IsNumber()
  autorId: number; // Author

  @IsOptional()
  @IsEnum(TypeStatus)
  type: TypeStatus; // 0: Салбар хэлтэс 1: Албан тушаал 2: Компани 3: Бүлэг

  @IsOptional()
  @IsString()
  name: string; // нэр

  @IsOptional()
  @IsString()
  autorName: string; // нэр

  @IsOptional()
  @IsString()
  shortName: string; // short name

  @IsOptional()
  @IsString()
  workDuty: string; // Үндсэн чиг үүрэг

  @IsOptional()
  @IsNumber()
  pos: number; // position

  @IsOptional()
  @IsNumber()
  position: number; // Орон тоо

  @IsOptional()
  @IsNumber()
  totalNumber: number; // Нийт эрхийн тоо

  @IsOptional()
  @IsEnum(TypeOfPosition)
  typeOfPosition?: TypeOfPosition; // Албан тушаалын төрөл

  @IsOptional()
  @IsEnum(Situation)
  situation?: Situation; // Нөхцөл

  @IsOptional()
  @IsEnum(DepartmentType)
  departmentType?: DepartmentType; // Алба/Хэлтэс/Тасаг/Лаборатори/Салбар

  @IsOptional()
  @IsNumber()
  isActive: number; // Идэвхтэй

  @IsOptional()
  @IsBoolean()
  isDevice: boolean; //

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date; // Системд нэмэгдсэн огноо

  @IsOptional()
  @IsNumber()
  preid: number; //  Өмнөх байгууллага

  @IsOptional()
  @IsNumber()
  insuranceTypeId: number; // Даатгуулагчийн төрөл

  @IsOptional()
  @IsNumber()
  occupationId: number; //
}
