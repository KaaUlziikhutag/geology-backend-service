import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetHumanDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  familyName: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  regNumber: string;

  @IsString()
  @IsOptional()
  workerId: number;
}
