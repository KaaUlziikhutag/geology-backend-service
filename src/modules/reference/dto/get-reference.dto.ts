import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class GetReferenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
