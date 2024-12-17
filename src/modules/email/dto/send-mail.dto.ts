import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendMailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(['invoice', 'appointment'])
  type: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  appointmentId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { each: true })
  orderIds?: number[] = [];
}
