import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MistakesType } from '@utils/enum-utils';
import { RelationIdDto } from '@utils/dto/relation-id.dto';
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
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[];

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
