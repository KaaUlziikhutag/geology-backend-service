import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetDoctorDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  authorId: number;

  @IsString()
  @IsOptional()
  userId: number;
}
