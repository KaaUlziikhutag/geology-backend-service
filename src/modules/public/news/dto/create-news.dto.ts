import { Type } from 'class-transformer';
import Trees from '../../../human-resource/tree/tree.entity';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsArray,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePublicNewsDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  // test delete hiih
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  currentAt?: Date = (() => {
    const now = new Date();
    const offset = 8 * 60 * 60 * 1000;
    const ubDate = new Date(now.getTime() + offset);
    return new Date(
      Date.UTC(
        ubDate.getUTCFullYear(),
        ubDate.getUTCMonth(),
        ubDate.getUTCDate(),
        ubDate.getUTCHours(),
        ubDate.getUTCMinutes(),
        ubDate.getUTCSeconds(),
      ),
    );
  })();

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  photoIds?: number[];

  trees?: Trees[];

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  @IsOptional()
  @IsString()
  intro: string;

  @IsOptional()
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  youtube: string;

  @IsOptional()
  @IsString()
  folder: string;

  @IsOptional()
  @IsNumber()
  status: number;

  @IsOptional()
  @IsNumber()
  access: number;

  @IsOptional()
  @IsNumber()
  share: number;

  @IsOptional()
  @IsNumber()
  likeCount: number;

  @IsOptional()
  @IsDateString()
  date: Date; //

  @IsOptional()
  @IsBoolean()
  isCommentHide: boolean;

  @IsOptional()
  @IsBoolean()
  isOut: boolean;

  @IsOptional()
  @IsBoolean()
  isLiked: boolean;

  @IsOptional()
  @IsString()
  comName: string;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  like: number;

  @IsOptional()
  author?: Record<string, any>;
}
