import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class IdsDto {
  @ApiProperty({
    example: [1, 2],
    description: 'List of IDs to identify resources',
  })
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
