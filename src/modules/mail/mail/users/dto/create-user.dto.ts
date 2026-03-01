import {
  IsNumber,
  IsDefined,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { MailType } from '../../../../../utils/enumUtils';

export class CreateUserDto {
  @IsDefined()
  @IsOptional()
  @IsNumber()
  userId: number; // User id

  @IsDefined()
  @IsOptional()
  @IsNumber()
  mailId: number; // Contract id

  @IsOptional()
  @IsEnum(MailType)
  state: MailType;

  @IsOptional()
  @IsNumber()
  groupId: number; // User id

  @IsOptional()
  @IsNumber()
  replyId: number; // User id

  @IsOptional()
  @IsNumber()
  signatureId: number; // User id

  @IsOptional()
  @IsBoolean()
  isTo: boolean;

  @IsOptional()
  @IsBoolean()
  isCc: boolean;

  @IsOptional()
  @IsBoolean()
  isBcc: boolean;

  @IsOptional()
  @IsBoolean()
  isExist: boolean;

  @IsOptional()
  @IsBoolean()
  isFavourite: boolean;

  @IsOptional()
  @IsBoolean()
  isTrash: boolean;

  @IsOptional()
  @IsBoolean()
  isRead: boolean;

  @IsOptional()
  @IsDateString()
  date: Date;

  @IsOptional()
  @IsDateString()
  starredDate: Date;
}

export default CreateUserDto;
