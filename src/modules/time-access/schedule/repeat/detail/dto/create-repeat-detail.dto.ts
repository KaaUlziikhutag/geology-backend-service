import Trees from '../../../../../human-resource/tree/tree.entity';
import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';
export class CreateRepeatDetailDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  repeatId: number;

  @IsOptional()
  @IsNumber()
  position: number;

  @IsOptional()
  @IsNumber()
  startPosition: number;

  @IsOptional()
  @IsNumber()
  graphicId: number;

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = [];

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  trees?: Trees[];
}
