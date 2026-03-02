import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetSoldiersDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  workerId: number;

  @IsString()
  @IsOptional()
  comId: number;
}
