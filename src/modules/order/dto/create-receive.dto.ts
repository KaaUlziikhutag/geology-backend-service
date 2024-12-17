import { IsArray, IsNumber } from 'class-validator';

export class CreateReceiveDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
