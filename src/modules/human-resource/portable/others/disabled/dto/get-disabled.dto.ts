import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../../utils/dto/pageOptions.dto';

export class GetDisabledDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  workerId: number;

  @IsString()
  @IsOptional()
  comId: number;
}
