import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetOptionDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  comId: number;
}
