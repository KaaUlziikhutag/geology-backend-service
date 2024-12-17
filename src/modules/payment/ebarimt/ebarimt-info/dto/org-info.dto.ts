import { ApiProperty } from '@nestjs/swagger';

export class OrgInfoDto {
  @ApiProperty()
  vatpayerRegisteredDate: string;

  @ApiProperty()
  lastReceiptDate: string;

  @ApiProperty()
  receiptFound: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  freeProject: boolean;

  @ApiProperty()
  found: boolean;

  @ApiProperty()
  citypayer: boolean;

  @ApiProperty()
  vatpayer: boolean;
}
