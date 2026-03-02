import { RelationIdDto } from '@utils/dto/relation-id.dto';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
export class CreateSignatureDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  pos: string;

  @IsOptional()
  @IsString()
  body: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[];

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  access: number;

  @IsOptional()
  @IsNumber()
  share: number;

  @IsOptional()
  @IsDateString()
  date: Date; //

  @IsOptional()
  @IsBoolean()
  isStandart: boolean;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
  isGreenTree: boolean;
}
