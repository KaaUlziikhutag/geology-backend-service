import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  workerId: number; // Эмнэлгийн id

  @IsOptional()
  @IsNumber()
  companyId: number; // Эмнэлгийн id

  @IsNotEmpty()
  @IsEmail()
  email: string; // Хэрэглэгчийн системд нэвтрэх нэр

  @IsString()
  phoneNo: string; // Утасны дугаар

  @IsOptional()
  @IsString()
  firstName: string; // Эцэг эхийн нэр

  @IsOptional()
  @IsString()
  lastName: string; // Өөрийн нэр

  @IsOptional()
  @IsString()
  password: string; // Системийн нууц үг

  @IsOptional()
  @IsString()
  dataBase: string; // Датабааз

  @IsOptional()
  @IsNumber()
  profileId?: number; // нүүр зургийн id

  @IsOptional()
  @IsNumber()
  isActive?: number;
}
