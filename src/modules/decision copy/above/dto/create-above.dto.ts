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
export class CreateAbovetDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  voidContract: number;

  @IsOptional()
  @IsNumber()
  overSideContractNumber: number;

  @IsOptional()
  @IsArray()
  workerIds?: number[] = [];

  workers?: Worker[];

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  trees?: Trees[];

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = [];

  @IsOptional()
  @IsArray()
  implementationWithIds?: number[] = [];

  implementationWiths?: Worker[];

  @IsOptional()
  @IsArray()
  supervisorIds?: number[] = [];

  supervisorAboveWorkers?: Worker[];

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(SecurityLevel)
  isSecret: SecurityLevel;

  @IsOptional()
  @IsDateString()
  canceledDate: Date; //

  @IsOptional()
  @IsEnum(ContractState)
  state: ContractState;

  @IsOptional()
  @IsEnum(ProgressStatus)
  isExc: ProgressStatus;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @IsString()
  outName: string;

  @IsOptional()
  @IsString()
  number: string;

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
  organizationId: number;

  @IsOptional()
  @IsNumber()
  unitCount: number;

  @IsOptional()
  @IsString()
  subNumber: string;

  @IsOptional()
  @IsNumber()
  pageCount: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsNumber()
  cardNumber: number;

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
  ownDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

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
}
