import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import RegisterDto from '../../authentication/dto/register.dto';

export class UpdateUsersDto extends PartialType(RegisterDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
