import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TaxType } from '../../../utils/enum-utils.js';

export default class CreateProductDto {
  @IsDefined()
  @IsNumber()
  sectionId: number;

  @IsDefined()
  @IsNumber()
  classificationId: number;

  @IsDefined()
  @IsEnum(TaxType)
  taxType: TaxType;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
