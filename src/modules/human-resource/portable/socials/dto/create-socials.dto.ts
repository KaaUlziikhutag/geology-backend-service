import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MoneyType } from '@utils/enum-utils';
import { RelationIdDto } from '@utils/dto/relation-id.dto';
export class CreateSocialsDto {
  // Нийгмийн халамж
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsEnum(MoneyType)
  unit: MoneyType; // Мөнгөний төрөл

  @IsOptional()
  @IsString()
  number: string; // Тушаалын дугаар

  @IsOptional()
  @IsString()
  type: string; // Халамжийн төрөл

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[];

  @IsOptional()
  @IsString()
  reason: string; // Олгосон Шалтгаан тайлбар

  @IsOptional()
  @IsNumber()
  money: number; // Мөнгөн дүн

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date; // Огноо
}
