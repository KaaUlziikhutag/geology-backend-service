import { IsNumber, IsString } from 'class-validator';

export default class CreateApiLogDto {
  @IsString()
  systemName: string;

  @IsString()
  requestType: string;

  @IsNumber()
  statusCode: number;

  @IsNumber()
  userId: number;

  @IsString()
  errorMsg: string;

  @IsString()
  requestPayload: string;

  @IsString()
  responcePayload: string;
}
