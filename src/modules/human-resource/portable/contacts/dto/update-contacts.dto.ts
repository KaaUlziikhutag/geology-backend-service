import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateContactDto } from './create-contacts.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
