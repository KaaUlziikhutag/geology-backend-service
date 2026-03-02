import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

export class ReorderCategoryDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  categoryId: number;

  @ApiProperty()
  @IsInt()
  position: number;
}
