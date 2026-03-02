import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { SslType } from '@utils/enum-utils';

export class CreateServerDto {
  @IsOptional()
  @IsString()
  host: string;

  @IsOptional()
  @IsString()
  incoming: string;

  @IsOptional()
  @IsNumber()
  incomingPort: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsEnum(SslType)
  incomingSsl: SslType;

  @IsOptional()
  @IsNumber()
  incomingValidate: number;

  @IsOptional()
  @IsString()
  outgoing: string;

  @IsOptional()
  @IsNumber()
  outgoingPort: number;

  @IsOptional()
  @IsEnum(SslType)
  outgoingSsl: SslType;

  @IsOptional()
  @IsNumber()
  outgoingValidate: number;
}
