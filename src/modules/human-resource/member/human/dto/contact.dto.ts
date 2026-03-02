import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContactPersonStatus } from '@utils/enum-utils';

export class ContactDto {
  @IsOptional()
  @IsString()
  contactPhoneNo: string; // Утасны дугаар

  @IsOptional()
  @IsEnum(ContactPersonStatus)
  contactPersonStatusType: ContactPersonStatus; // Холбоо барих хүний хэн болох

  @IsOptional()
  @IsString()
  name: string; // Нэр

  @IsOptional()
  @IsString()
  faceBook: string; // Facebook хаяг

  @IsOptional()
  @IsString()
  otherSocial: string; //  Бусад сошиал хаяг
}
