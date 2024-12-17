import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  msg: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  loginName: string;

  @ApiProperty()
  email: string;
}
