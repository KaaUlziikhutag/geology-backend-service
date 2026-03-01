import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetMailDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  subject: string;

  @IsNumberString()
  @IsOptional()
  userId: number;

  @IsNumberString()
  @IsOptional()
  mailType: number;

  @IsBooleanString()
  @IsOptional()
  isFavourite: boolean;

  @IsBooleanString()
  @IsOptional()
  isRead: boolean;

  @IsBooleanString()
  @IsOptional()
  isTrash: boolean;
}
