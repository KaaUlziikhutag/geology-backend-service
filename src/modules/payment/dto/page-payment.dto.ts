import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../utils/dto/page-options.dto.js';

export default class PagePaymentDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  search: string;
}
