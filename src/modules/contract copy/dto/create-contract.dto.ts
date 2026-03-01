import { Type } from 'class-transformer';
import { ContractState, FileDto } from '../../../utils/globalUtils';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { SchudleDto } from './schudle.dto';
import Trees from '../../human-resource/tree/tree.entity';
export class CreateContractDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  certificatefileIds: FileDto[];

  @IsOptional()
  @IsNumber()
  voidContract: number;

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  trees?: Trees[];

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = []; // Гэрээг харах эрхтэй хэрэглэгчид

  @IsOptional()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  outPhone: string;

  @IsOptional()
  @IsBoolean()
  isSchedule: boolean; //

  @IsOptional()
  @IsBoolean()
  isContractAdd: boolean;

  @IsOptional()
  @IsBoolean()
  isWarraty: boolean;

  @IsOptional()
  @IsBoolean()
  isUniqueValue: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SchudleDto)
  schedule: SchudleDto[];

  @IsOptional()
  @IsNumber()
  mainContractId: number;

  @IsOptional()
  @IsString()
  mainContractName: string;

  @IsOptional()
  @IsString()
  overSideContractNumber: string;

  @IsOptional()
  @IsNumber()
  createdAtCountry: number;

  @IsOptional()
  @IsNumber()
  createdAtCity: number;

  @IsOptional()
  @IsString()
  durationOfYear: string;

  @IsOptional()
  @IsString()
  durationOfMonth: string;

  @IsOptional()
  @IsString()
  durationOfDay: string;

  @IsOptional()
  @IsEnum(ContractState)
  state: ContractState;

  @IsOptional()
  @IsArray()
  delegateOurIds?: number[]; // Гэрээ доторх төлөөлөгчид - Eoffice хэрэглэгчид

  @IsOptional()
  @IsArray()
  delegateOuts?: string[]; // Гэрээ гаднах төлөөлөгчид - Системийн хэрэглэгчид биш

  @IsOptional()
  @IsString()
  depName: string;

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
  @IsNumber()
  isCertificate: number;

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
  number: string;

  @IsOptional()
  @IsString()
  numKey: string;

  @IsOptional()
  @IsString()
  numCnt: string;

  @IsOptional()
  @IsString()
  place: string;

  @IsOptional()
  @IsString()
  placeCountry: string;

  @IsOptional()
  @IsDateString()
  addDate: Date; //

  @IsOptional()
  @IsDateString()
  endDate: Date; //

  @IsOptional()
  @IsDateString()
  warratyDate: Date; //

  @IsOptional()
  @IsDateString()
  canceledDate: Date; //

  @IsOptional()
  @IsDateString()
  contractCreateDate: Date; //

  @IsOptional()
  @IsNumber()
  placeCountryId: number;

  @IsOptional()
  @IsNumber()
  placeCityId: number;

  @IsOptional()
  @IsNumber()
  placeCommetteeId: number;

  @IsOptional()
  @IsNumber()
  placeDistrictId: number;

  @IsOptional()
  @IsNumber()
  warratyValue: number;

  @IsOptional()
  @IsNumber()
  uniqueLoss: number;

  @IsOptional()
  @IsNumber()
  uniquePerday: number;

  @IsOptional()
  @IsNumber()
  uniqueMax: number;

  @IsOptional()
  @IsNumber()
  payment: number;

  @IsOptional()
  @IsString()
  paymentComments: string;

  @IsOptional()
  @IsString()
  priceDecision: string;

  @IsOptional()
  @IsString()
  endDateComment: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  shortComment: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isDraft: boolean; //

  @IsOptional()
  @IsBoolean()
  isTime: boolean; //

  @IsOptional()
  @IsNumber()
  categoryId: number; // Ангилал

  @IsOptional()
  @IsNumber()
  typeId: number; // Ангилал
}
