import { IsString, IsOptional, IsDate, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';
import { Type } from 'class-transformer';

export class GetAppointmentDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  authorId: number;

  @IsString()
  @IsOptional()
  holderId: number;

  @IsString()
  @IsOptional()
  comId: number;

  @IsString()
  @IsOptional()
  depId: number;

  @IsString()
  @IsOptional()
  itemId: number;

  @IsOptional()
  @IsNumberString()
  status: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @IsNumberString()
  @IsOptional()
  type: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt: Date;

  @IsNumberString()
  @IsOptional()
  accessType: number;

  @IsOptional()
  @IsString()
  ids: string;

  @IsNumberString()
  @IsOptional()
  workerId: number;
}
