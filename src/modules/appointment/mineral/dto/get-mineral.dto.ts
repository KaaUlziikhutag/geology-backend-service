import { MineralState } from '../../../../utils/enum-utils.js';
import { PageOptionsDto } from '../../../../utils/dto/page-options.dto.js';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class GetMineralDto extends PageOptionsDto {
  @IsOptional()
  @IsNumberString()
  appointmentId: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(MineralState)
  state: MineralState;
}
