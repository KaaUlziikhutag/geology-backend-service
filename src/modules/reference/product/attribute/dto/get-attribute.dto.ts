import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export default class GetAttributeDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  categoryId: number;
}
