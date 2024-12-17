import { ApiProperty } from '@nestjs/swagger';
export class Receipt {
  @ApiProperty()
  id: string;
}
export class CreateReceiptRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  posId: string;

  @ApiProperty()
  status: 'SUCCESS' | 'ERROR' | 'PAYMENT';

  @ApiProperty()
  message: string;

  @ApiProperty()
  qrData: string;

  @ApiProperty()
  lottery: string;

  @ApiProperty()
  printedAt: Date;

  @ApiProperty()
  receipts: Receipt[];
}
