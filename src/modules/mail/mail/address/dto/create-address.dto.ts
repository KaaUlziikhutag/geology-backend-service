import {
  IsNumber,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { MailAddressType } from '@utils/enum-utils';

export class CreateAddressDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  mailId: number; // Mail id

  @IsOptional()
  @IsString()
  personal: string;

  @IsOptional()
  @IsString()
  mailbox: string;

  @IsOptional()
  @IsString()
  host: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsEnum(MailAddressType)
  state: MailAddressType;
}

export default CreateAddressDto;
