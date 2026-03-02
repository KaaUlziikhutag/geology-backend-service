import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RelationIdDto } from '@utils/dto/relation-id.dto';

export class CreateDescriptionDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  appId: number;

  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  duty: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[]; // Хавсаргах файл

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
