import { IsOptional, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { AccessType } from '../../../../utils/globalUtils';
export class CreateAccessDto {
  // Системийн хандалт
  @IsNotEmpty()
  @IsNumber()
  workerId: number;

  @IsNotEmpty()
  @IsNumber()
  proId: number;

  @IsNotEmpty()
  @IsNumber()
  modId: number;

  @IsOptional()
  @IsEnum(AccessType)
  access: AccessType;

  @IsNotEmpty()
  @IsNumber()
  comId: number;
}
