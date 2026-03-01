import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../../utils/dto/page-options.dto';
import { GetRangeDateDto } from '../../../utils/dto/get-date.dto';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ReceiptStatus } from '../../../utils/enum-utils';

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
