import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetOptionDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  comId: number;
}
