import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ReceiptItemDto } from './receipt-item.dto.js';
import { TaxType } from '../../../../utils/enum-utils.js';

/** Дэд төлбөрийн баримт */
export class ReceiptDto {
  @IsOptional()
  @IsNumber()
  totalAmount: number; // Дэд төлбөрийн баримтын гүйлгээний нийт дүн Бүх төрлийн татвар шингэсэн дүн

  @IsOptional()
  @IsNumber()
  totalVAT: number; // Дэд төлбөрийн баримтын НӨАТ-н нийт дүн

  @IsOptional()
  @IsNumber()
  totalCityTax: number; // Дэд төлбөрийн баримтын НХАТ-н нийт дүн

  @IsOptional()
  @IsEnum(TaxType)
  taxType: TaxType; // Татварын төрөл

  @IsOptional()
  @IsNumberString()
  @Length(11, 14)
  merchantTin: string; // Борлуулагчийн ТТД

  @IsOptional()
  @IsString()
  bankAccountNo: string; // Нэхэмжлэхийн банкны дансны дугаар

  @IsOptional()
  @ValidateNested({ each: true })
  items: ReceiptItemDto[];
}
