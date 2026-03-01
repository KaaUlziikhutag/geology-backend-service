import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FileDto, MistakesType } from '../../../../../utils/globalUtils';
export class CreateMistakesDto {
  // Алдаа дутагдал
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsEnum(MistakesType)
  type: MistakesType; // Төрөл

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @IsString()
  number: string; // Тушаалын дугаар

  @IsOptional()
  @IsString()
  mistakes: string; // Алдаа дутагдал

  @IsOptional()
  @IsString()
  reason: string; // Шалтгаан тайлбар

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date; // Огноо
}
