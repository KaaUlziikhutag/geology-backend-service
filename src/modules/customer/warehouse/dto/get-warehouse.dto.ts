import { IsNumberString, IsOptional, IsString } from 'class-validator';

export default class GetWarehouseDto {
  @IsOptional()
  @IsNumberString()
  customerId: number;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  name: string;
}
