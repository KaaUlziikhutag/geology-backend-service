import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OrderState } from '../../../utils/enum-utils';
import { Type } from 'class-transformer';
import { GetRangeDateDto } from '../../../utils/dto/get-date.dto';

export default class GetOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  appointmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  customerId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  sectionId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderState)
  state?: OrderState;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRangeDateDto)
  createdAt?: GetRangeDateDto;
}
