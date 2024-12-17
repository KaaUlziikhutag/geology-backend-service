import { IsString } from 'class-validator';

export class CreateApprovaQrDto {
  @IsString()
  customerNo: string; // Харилцагчийн e-barimt бүртгэлтэй дугаар

  @IsString()
  qrData: string; // createReceipt гарч ирсэн qrData
}
