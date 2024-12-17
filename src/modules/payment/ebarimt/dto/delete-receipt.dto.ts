import { IsDateString, IsOptional, IsString } from 'class-validator';
/** PosAPI-руу төлбөрийн баримт буцаах сервис */
export class DeleteReceiptDto {
  @IsOptional()
  @IsString()
  id: string; // Багц төлбөрийн баримтын ДДТД 33 оронтой тоо

  @IsOptional()
  @IsDateString()
  date: string; // Баримт хэвлэсэн огноо "yyyy-MM-dd HH:mm:ss" форматтай огноо
}
