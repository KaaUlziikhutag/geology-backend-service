import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { RegionLevel } from '../region.enums';

export default class FindRegionDto {
  @ApiPropertyOptional()
  @IsEnum(RegionLevel)
  @IsOptional()
  level?: RegionLevel = RegionLevel.Zone;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
