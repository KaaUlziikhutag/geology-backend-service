import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export default class GetAttributeDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  categoryId: number;
}
