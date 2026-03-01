import {
  IsNumber,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFileDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  mailId: number; // Mail id

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  originalName: string;

  @IsOptional()
  @IsNumber()
  size: number;
}

export default CreateFileDto;
