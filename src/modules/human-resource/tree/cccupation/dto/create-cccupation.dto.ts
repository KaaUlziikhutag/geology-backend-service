import { JobCategory } from '@utils/enum-utils';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDefined,
  IsEnum,
} from 'class-validator';

export class CreateoccupationDto {
  @IsOptional()
  @IsString()
  code: string; // КОД

  @IsOptional()
  @IsString()
  name: string; // НЭР

  @IsOptional()
  @IsNumber()
  mid: number; // tree id

  @IsDefined()
  @IsEnum(JobCategory)
  type: JobCategory; // type
}
