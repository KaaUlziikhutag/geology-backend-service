import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAppDeclareDto } from './create-app-declare.dto';

export class UpdateAppDeclareDto extends PartialType(CreateAppDeclareDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
