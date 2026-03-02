import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContactFormat } from '@utils/enum-utils';

export class SchudleDto {
  @IsOptional()
  @IsString()
  scheduleValue: string; // *Хуваарийн утга

  @IsOptional()
  @IsNumber()
  paymentAmount: number; // Төлөх дүн

  @IsOptional()
  @IsDateString()
  paymentDate: Date; // Төлөх огноо

  @IsOptional()
  @IsEnum(ContactFormat)
  format: ContactFormat; // Төлбөрийн нөхцөл
}
