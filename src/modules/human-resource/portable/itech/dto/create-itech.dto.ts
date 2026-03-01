import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { FileDto, ItechType } from '../../../../../utils/globalUtils';
import { Type } from 'class-transformer';

export class CreateItechDto {
  @IsOptional()
  @IsEnum(ItechType)
  itechType?: ItechType;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.officeData !== undefined)
  officeData?: Record<string, any>;
}
