import { RelationIdDto } from '@utils/dto/relation-id.dto';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateDisabledDto {
  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  workerId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  percentage: number;

  @IsOptional()
  @IsString()
  commissionName: string;

  @IsOptional()
  @IsNumber()
  isDisabled: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationIdDto)
  fileIds: RelationIdDto[];

  @IsOptional()
  @IsString()
  disabledInfo: string;
}
