import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateIpAddressDto {
  @IsOptional()
  @IsString()
  ip: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  access: number;

  @IsOptional()
  @IsNumber()
  share: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsArray()
  workerIds?: number[] = []; // Ip хаягт хамаарах хэрэглэгчид
}
