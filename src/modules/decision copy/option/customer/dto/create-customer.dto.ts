import { IsString, IsOptional } from 'class-validator';
export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  fax: string;

  @IsOptional()
  @IsString()
  web: string;

  @IsOptional()
  @IsString()
  address: string;
}
