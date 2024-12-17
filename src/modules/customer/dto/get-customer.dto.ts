import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../utils/dto/page-options.dto.js';
import { CustomerType } from '../../../utils/enum-utils.js';

export default class GetCustomerDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(CustomerType)
  type: CustomerType;

  @IsOptional()
  @IsNumberString()
  provinceId: number;

  @IsOptional()
  @IsNumberString()
  districtId: number;

  @IsOptional()
  @IsString()
  search: string;
}
