import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { UserIdsDto } from './create-agree-byuser.dto';

export class UpdateAgreeByuserDto extends PartialType(UserIdsDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
