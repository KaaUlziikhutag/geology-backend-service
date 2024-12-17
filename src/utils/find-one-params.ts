import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export default class FindOneParams {
  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  id: number;
}
