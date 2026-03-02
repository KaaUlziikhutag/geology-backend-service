import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RelationIdDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  id: number;
}
