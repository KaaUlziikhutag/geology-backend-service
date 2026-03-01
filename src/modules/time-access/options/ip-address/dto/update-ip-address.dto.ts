import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateIpAddressDto } from './create-ip-address.dto';

export class UpdateIpSettingDto extends PartialType(CreateIpAddressDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
