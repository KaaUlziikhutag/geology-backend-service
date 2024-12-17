import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetIndicatorDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumberString()
  measurementId: number;

  @IsOptional()
  @IsNumberString()
  productId: number;

  @IsOptional()
  @IsNumberString()
  elementId: number;
}
