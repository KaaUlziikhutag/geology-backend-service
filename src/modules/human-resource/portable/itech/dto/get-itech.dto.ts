import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetItechDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsNumberString()
  itechType: number;

  @IsOptional()
  @IsNumberString()
  userId: number;
}
