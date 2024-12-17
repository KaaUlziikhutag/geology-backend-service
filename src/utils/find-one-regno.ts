import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class FindOneRegno {
  @ApiProperty()
  @IsString()
  @IsOptional()
  regno: string;
}
