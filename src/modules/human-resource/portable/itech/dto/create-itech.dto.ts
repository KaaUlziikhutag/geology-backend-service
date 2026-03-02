import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ItechType } from '@utils/enum-utils';
import { Type } from 'class-transformer';
import { RelationIdDto } from '@utils/dto/relation-id.dto';

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
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[];

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.officeData !== undefined)
  officeData?: Record<string, any>;
}
