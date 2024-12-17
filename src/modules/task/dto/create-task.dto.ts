import { IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsNumber()
  mineralId: number;

  @ApiProperty()
  @IsNumber()
  orderId: number;

  @ApiProperty()
  @IsBoolean()
  isDuplicate: boolean;
}
