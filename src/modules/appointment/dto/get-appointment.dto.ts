import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../../utils/dto/page-options.dto.js';
import { GetRangeDateDto } from '../../../utils/dto/get-date.dto.js';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ReceiptStatus } from '../../../utils/enum-utils.js';

export default class GetAppointmentDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GetRangeDateDto)
  createdAt?: GetRangeDateDto;

  @IsOptional()
  @IsEnum(ReceiptStatus)
  paymentStatus?: ReceiptStatus;
}
