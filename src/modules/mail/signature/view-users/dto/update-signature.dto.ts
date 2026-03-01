import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import CreateViewUserDto from './create-view-user.dto';

export class UpdateSignatureViewUserDto extends PartialType(CreateViewUserDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
