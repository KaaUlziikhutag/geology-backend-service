import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
