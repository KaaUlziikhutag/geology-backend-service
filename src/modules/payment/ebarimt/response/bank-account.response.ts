import { ApiProperty } from '@nestjs/swagger';

export class BankAccount {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tin: number;

  @ApiProperty()
  bankAccountNo: string;

  @ApiProperty()
  bankAccountName: string;

  @ApiProperty()
  bankId: number;

  @ApiProperty()
  bankName: string;
}
