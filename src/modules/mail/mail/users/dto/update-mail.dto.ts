import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import CreateUserDto from './create-user.dto';

export class UpdateUserMailDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
