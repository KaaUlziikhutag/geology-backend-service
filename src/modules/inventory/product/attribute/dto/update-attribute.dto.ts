import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import CreateAttributeDto from './create-attribute.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id: string;
}
