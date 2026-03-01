import {
  IsNumber,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateViewUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  userId: number; // User id

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  contractId: number; // Contract id

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export default CreateViewUserDto;
