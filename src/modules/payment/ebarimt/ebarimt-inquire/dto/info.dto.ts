import { ApiProperty } from '@nestjs/swagger';

class InfoDataDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  found: boolean; // Татвар төлөгчөөр бүртгэлтэй эсэх

  @ApiProperty()
  vatPayer: boolean; // НӨАТ суутган төлөгч эсэх

  @ApiProperty()
  cityPayer: boolean; // НХАТ суутгагч эсэх

  @ApiProperty()
  freeProject: boolean; // НӨАТ-аас чөлөөлөгдөх төсөл хөтөлбөр эсэх

  @ApiProperty()
  vatpayerRegisteredDate: string; // НӨАТ суутган төлөгчөөр бүртгүүлсэн огноо
}

export class InfoDto {
  @ApiProperty()
  msg: string;

  @ApiProperty()
  status: number; // Service ийн төлөв

  @ApiProperty()
  data: InfoDataDto;
}
