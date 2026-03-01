import { IsNumber, IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateViewUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  userId: number; // User id

  @IsNumber()
  @IsOptional()
  aboveId: number; // Above id

  @IsNumber()
  @IsOptional()
  innerId: number; // Inner id
}

export default CreateViewUserDto;
