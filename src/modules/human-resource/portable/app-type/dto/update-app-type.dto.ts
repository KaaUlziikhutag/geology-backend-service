import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAppTypeDto } from './create-app-type.dto';

export class UpdateAppTypeDto extends PartialType(CreateAppTypeDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
