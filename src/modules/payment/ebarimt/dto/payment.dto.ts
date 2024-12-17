import { EbarimtPaymentCode } from '../../../../utils/enum-utils.js';
import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

/** Төлбөрийн хэлбэр */
export class PaymentDto {
  @IsOptional()
  @IsEnum(EbarimtPaymentCode)
  code: EbarimtPaymentCode; // Төлбөрийн хэлбэрийн код

  @IsOptional()
  @IsString()
  exchangeCode: string; // Төлбөр хийж гүйцэтгэх гуравдагч системийн код

  @IsOptional()
  @IsNumber()
  paidAmount: number; // Нийт төлсөн дүн

  @IsOptional()
  @IsString()
  @IsIn(['PAID', 'PAY', 'REVERSED', 'ERROR'])
  status: 'PAID' | 'PAY' | 'REVERSED' | 'ERROR';
  // PAID - Төлбөр амжилттай хийгдсэнийг тодорхойлоно
  // PAY -  Төлбөрийн мэдээллийг “Баримтын мэдээлэл солилцох сервис”-г ашиглан гүйцэтгэнэ.
  // REVERSED -  Төлбөр буцаагдсан
  // ERROR -  Төлөлт амжилтгүй болсон
}
