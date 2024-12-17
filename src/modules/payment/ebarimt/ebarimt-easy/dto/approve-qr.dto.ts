import { ApiProperty } from '@nestjs/swagger';

export class ApproveQrDto {
  @ApiProperty()
  msg: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  status: number;
}
