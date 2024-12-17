import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PosApiInfo {
  @ApiProperty()
  operatorName: string;

  @ApiProperty()
  operatorTIN: number;

  @ApiProperty()
  posId: string;

  @ApiProperty()
  posNo: number;

  @ApiProperty()
  version: string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Expose({ name: 'lastSentDate' })
  @IsDate()
  @ApiProperty()
  lastSentDate: Date;

  @ApiProperty()
  leftLotteries: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AppInfo)
  appInfo: AppInfo;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PaymentType)
  paymentTypes: PaymentType[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => Merchant)
  merchants: Merchant[];
}

export class AppInfo {
  @IsString()
  applicationDir: string;

  @IsString()
  currentDir: string;

  @IsString()
  database: string;

  @Expose({ name: 'database-host' })
  @IsString()
  databaseHost: string;

  @IsString()
  workDir: string;
}

export class PaymentType {
  @IsString()
  code: string;

  @IsString()
  name: string;
}

export class Merchant {
  @IsString()
  name: string;

  @IsInt()
  tin: number;

  @IsBoolean()
  vatPayer: boolean;

  @ValidateNested({ each: true })
  @Type(() => Customer)
  customers: Customer[];
}

export class Customer {
  @IsString()
  name: string;

  @IsInt()
  tin: number;

  @IsBoolean()
  vatPayer: boolean;
}
