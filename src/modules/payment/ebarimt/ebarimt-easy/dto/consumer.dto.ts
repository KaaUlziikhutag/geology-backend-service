import { ApiProperty } from '@nestjs/swagger';

export class ConsumerDto {
  @ApiProperty()
  regNo: string;

  @ApiProperty()
  loginName: string;

  @ApiProperty()
  givenName: string;

  @ApiProperty()
  familyName: string;
}
