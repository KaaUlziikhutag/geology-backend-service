import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateWarehouseDto {
  @IsDefined()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
