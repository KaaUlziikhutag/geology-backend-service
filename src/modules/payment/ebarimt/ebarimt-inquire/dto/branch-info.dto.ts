import { ApiProperty } from '@nestjs/swagger';

class BranchInfoDataDto {
  @ApiProperty()
  branchCode: string;

  @ApiProperty()
  branchName: string;

  @ApiProperty()
  subBranchCode: string;

  @ApiProperty()
  subBranchName: string;
}

export class BranchInfoDto {
  @ApiProperty()
  msg: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  data: BranchInfoDataDto[];
}
