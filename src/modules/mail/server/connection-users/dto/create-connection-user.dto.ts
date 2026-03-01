import {
  IsNumber,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateConnectionUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  userId: number; // User id

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  serverId: number; // Server id

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string; // Email Unique

  @IsString()
  phone: string;

  @IsOptional()
  @IsDateString()
  excDate: Date; //
}

export default CreateConnectionUserDto;
