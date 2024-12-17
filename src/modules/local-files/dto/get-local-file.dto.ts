import { IsNumberString, IsOptional } from 'class-validator';

export class GetLocalFileDto {
  @IsOptional()
  @IsNumberString({}, { each: true })
  ids: number[];
}
