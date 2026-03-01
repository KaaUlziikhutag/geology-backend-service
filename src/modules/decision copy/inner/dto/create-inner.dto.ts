import Trees from '../../../human-resource/tree/tree.entity';
import {
  ContractState,
  FileDto,
  ProgressStatus,
  SecurityLevel,
} from '../../../../utils/globalUtils';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import Worker from '../../../human-resource/member/worker/worker.entity';
export class CreateInnerDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  voidContract: number;

  @IsOptional()
  @IsArray()
  workerIds?: number[] = [];

  @IsOptional()
  @IsEnum(ContractState)
  state: ContractState;

  @IsOptional()
  @IsEnum(ProgressStatus)
  isExc: ProgressStatus;

  @IsOptional()
  @IsEnum(SecurityLevel)
  isSecret: SecurityLevel;

  @IsOptional()
  @IsDateString()
  canceledDate: Date; //

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  @IsOptional()
  @IsArray()
  implementationWithIds?: number[] = [];

  trees?: Trees[];

  workers?: Worker[];

  implementationWiths?: Worker[];

  supervisorInnerWorkers?: Worker[];

  @IsOptional()
  @IsArray()
  supervisorIds?: number[] = [];

  authorInnerWorkers?: Worker[];

  @IsOptional()
  @IsArray()
  authorUserIds?: number[] = [];

  signWorkers?: Worker[];

  @IsOptional()
  @IsArray()
  signUserIds?: number[] = [];

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = [];

  @IsOptional()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  pageCount: number;

  @IsOptional()
  @IsNumber()
  unitCount: number;

  @IsOptional()
  @IsNumber()
  typeId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsNumber()
  overSideContractNumber: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  rule: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  outName: string;

  @IsOptional()
  @IsString()
  outCode: string;

  @IsOptional()
  @IsString()
  ourName: string;

  @IsOptional()
  @IsString()
  outConfirmName: string;

  @IsOptional()
  @IsString()
  ourConfirmName: string;

  @IsOptional()
  @IsNumber()
  ourConfirmId: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  subNumber: string;

  @IsOptional()
  @IsString()
  cardNumber: string;

  @IsOptional()
  @IsNumber()
  confirmUserId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  excDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sendDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  answeredDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ownDate: Date;

  @IsOptional()
  @IsBoolean()
  isTime: boolean;

  @IsOptional()
  @IsBoolean()
  isInstant: boolean;

  @IsOptional()
  @IsBoolean()
  isDraft: boolean;

  @IsOptional()
  @IsBoolean()
  isInner: boolean;

  @IsOptional()
  @IsNumber()
  fileId: number;

  @IsOptional()
  @IsNumber()
  innerId: number;
}
