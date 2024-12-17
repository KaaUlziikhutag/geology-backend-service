import { ApiProperty } from '@nestjs/swagger';

export class TinInfoDto {
  @ApiProperty()
  msg: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  data: string;
}
