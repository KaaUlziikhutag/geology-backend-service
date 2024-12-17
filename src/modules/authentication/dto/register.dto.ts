import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsDefined,
  IsOptional,
  IsNumber,
  IsUrl,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  avatarId: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean; // Идэвхтэй эсэх
}

export default RegisterDto;
