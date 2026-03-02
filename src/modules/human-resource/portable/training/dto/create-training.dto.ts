import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RelationIdDto } from '@utils/dto/relation-id.dto';
export class CreateTrainingDto {
  // Хамрагдсан сургалт
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  autorId?: number;

  @IsOptional()
  @IsString()
  name: string; // Сургалтын нэр

  @IsOptional()
  @IsString()
  course: string; // Сургалтын чиглэл

  @IsOptional()
  @IsString()
  type: string; // Сургалтын төрөл

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[];

  @IsOptional()
  @IsString()
  organiser: string; // Зохион байгуулагч

  @IsOptional()
  @IsNumber()
  countryId: number; // Улс

  @IsOptional()
  @IsNumber()
  cityId: number; // Аймаг

  @IsOptional()
  @IsNumber()
  serNumber?: number; // Үнэмлэх №

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date; // Хамрагдсан он

  @IsOptional()
  @IsNumber()
  continuedTime?: number; // Үргэлжилсэн хуцгаа
}
