import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumberString, IsOptional } from 'class-validator';

export class GetNotificationDto {
  @ApiProperty()
  @IsNumberString()
  receiverId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isRead?: boolean;
}
