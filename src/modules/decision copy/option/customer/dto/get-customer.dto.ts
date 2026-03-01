import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetCustomerDto extends PartialType(PageOptionsDto) {
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
