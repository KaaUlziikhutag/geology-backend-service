import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { CustomerType } from '../../../utils/enum-utils';

export class GetMineraDto {
  @IsNumberString()
  @IsOptional()
  sectionId: number; // Үйлчлүүлэгчийн бүлэг

  @IsEnum(CustomerType)
  @IsOptional()
  type: CustomerType;
}
