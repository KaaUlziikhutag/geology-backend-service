import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDefined,
  IsNumber,
} from 'class-validator';
import { CountryType } from '@utils/enum-utils';

export class CreateCountryDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  parentId: number; //  ParentId

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  position: number; //  Байрлал

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string; //Аймаг, Сум, Хотын нэр

  @IsDefined()
  @IsEnum(CountryType)
  type: CountryType;
}
