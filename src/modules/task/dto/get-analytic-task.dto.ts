import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumberString,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { GetRangeDateDto } from '../../../utils/dto/get-date.dto.js';

export class GetAnalyticTaskDto {
  @ApiPropertyOptional({ description: 'Зардалтай захиалгын тоо' })
  @IsOptional()
  @IsNumberString()
  orderCount?: number;

  @ApiPropertyOptional({ description: 'Захиалгын тоог шүүх оператор' })
  @IsOptional()
  @IsString()
  @IsIn(['>', '<', '>=', '<=', '!=', '='])
  operator?: string;

  @ApiPropertyOptional({ description: 'Захиалгын тоог шүүх утга' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRangeDateDto)
  orderAt?: GetRangeDateDto;

  @ApiPropertyOptional({ description: 'Дээж төрөл ID' })
  @IsOptional()
  @IsNumberString()
  mineralTypeId?: number;

  @ApiPropertyOptional({ description: 'Бүтээгдэхүүний ID' })
  @IsOptional()
  @IsNumberString()
  productId?: number;
}
