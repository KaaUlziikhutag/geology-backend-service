import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class GetSectionDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  reportAt?: Date = new Date();
}
