import { IsDefined, IsNumber, IsNumberString } from 'class-validator';

export class InvoiceDto {
  @IsDefined()
  @IsNumberString()
  appointmentId: number;

  @IsDefined()
  @IsNumberString({}, { each: true })
  orderIds: number[];
}
