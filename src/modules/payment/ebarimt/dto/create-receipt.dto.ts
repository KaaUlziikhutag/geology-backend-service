import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ReceiptDto } from './receipt.dto';
import { Type } from 'class-transformer';
import { PaymentDto } from './payment.dto';
import { EbarimtTaxType } from '../../../../utils/enum-utils';
/** Төлбөрийн баримт үүсгэх */
export class CreateReceiptDto {
  @IsOptional()
  @IsNumber()
  totalAmount: number; // Багц баримтын гүйлгээний нийт дүн Бүх төрлийн татвар шингэсэн дүн

  @IsOptional()
  @IsNumber()
  totalVAT: number; // Багц баримтын НӨАТ-н нийт дүн // totalamount /1.1 *0.1

  @IsOptional()
  @IsNumber()
  totalCityTax: number; // Багц баримтын НХАТ-н нийт дүн

  @IsOptional()
  @IsNumberString()
  @Length(4)
  districtCode: string; // Баримт хэвлэсэн орон нутгийн код

  @IsOptional()
  @IsNumberString()
  @Length(11, 14)
  merchantTin: string; // Багц баримт олгогчийн ТТД

  @IsOptional()
  @IsString()
  branchNo: string; // Тухайн байгууллагын дотоод кассын дугаар

  @IsOptional()
  @IsNumberString()
  @Length(11, 14)
  customerTin: string; // Худалдан авагчийн ТТД

  @IsOptional()
  @IsNumberString()
  @Length(8)
  consumerNo: string; // Худалдан авагч иргэний ebarimt-н бүртгэлийн дугаар

  @IsOptional()
  @IsEnum(EbarimtTaxType)
  type: EbarimtTaxType; // Баримтын төрөл

  @IsOptional()
  @IsNumberString()
  @Length(33)
  inactiveId: string; // Засварлах баримтын ДДТД

  @IsOptional()
  @IsNumberString()
  @Length(33)
  invoiceId: string; // Тухайн төлбөрийн баримтын харгалзах нэхэмжлэхийн ДДТД

  @IsOptional()
  @IsDateString()
  reportMonth?: string; // "yyyy-MM-dd" форматтай огноо Баримт харьяалагдах тайлант сар

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReceiptDto)
  receipts: ReceiptDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments: PaymentDto[];
}
