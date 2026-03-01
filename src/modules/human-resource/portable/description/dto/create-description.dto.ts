import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FileDto } from '../../../../../utils/globalUtils';

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
  @Type(() => FileDto)
  fileIds: FileDto[]; // Хавсаргах файл

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
