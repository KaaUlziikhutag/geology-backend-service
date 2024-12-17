import { Type } from 'class-transformer';
import { IsNumberString, IsOptional, ValidateNested } from 'class-validator';
import { GetRangeDateDto } from '../../../utils/dto/get-date.dto.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export default class GetContractDto {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  customerId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRangeDateDto)
  currentAt?: GetRangeDateDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRangeDateDto)
  endAt?: GetRangeDateDto;
}
