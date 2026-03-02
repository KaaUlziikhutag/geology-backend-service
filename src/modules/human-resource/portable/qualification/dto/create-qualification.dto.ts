import { RelationIdDto } from '@utils/dto/relation-id.dto';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  ValidateNested,
} from 'class-validator';

export class CreateQualificationDto {
  @IsOptional()
  @IsNumber()
  userId: number; // worker Id

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[];

  @IsOptional()
  @IsString()
  organizationName: string; // Олгосон байгууллагын нэр

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date; // Авсан он сар өдөр

  @IsOptional()
  @IsString()
  degree: string; // Цол зэрэг эрхийн нэр

  @IsOptional()
  @IsNumber()
  countryId: number; // Улс хаана

  @IsOptional()
  @IsNumber()
  cityId: number; // Аймаг хаана

  @IsOptional()
  @IsString()
  certificateNumber: string; // Үнэмлэх гэрчилгээний дугаар

  @IsOptional()
  @IsNumber()
  isApplicant: number; //  одоо суралцаж байга эсэх
}
