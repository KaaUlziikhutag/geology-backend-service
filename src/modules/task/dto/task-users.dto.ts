import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsNumber } from 'class-validator';

export class TaskUsersDto {
  @ApiProperty({
    description: 'Даалгаваруудын ID-д',
    isArray: true,
    type: Number,
  })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  taskIds: number[];

  @ApiProperty({
    description: 'Хэрэглэгчийн ID-д',
    isArray: true,
    type: Number,
  })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  userIds: number[];
}
