import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FileDto, MoneyType } from '../../../../../utils/globalUtils';
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
  @Type(() => FileDto)
  fileIds: FileDto[];

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
