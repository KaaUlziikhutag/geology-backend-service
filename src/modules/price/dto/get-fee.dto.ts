import { IsDefined, IsNumberString } from 'class-validator';

export default class GetFeeDto {
  @IsDefined()
  @IsNumberString()
  priceId: number;

  @IsDefined()
  @IsNumberString()
  weight: number;
}
