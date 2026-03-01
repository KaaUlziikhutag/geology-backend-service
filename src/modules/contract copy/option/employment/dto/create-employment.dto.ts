import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  IsEnum,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { AdditionDto, ShboDto } from './addition.dto';
import {
  ContractState,
  FileDto,
  PerformanceType,
} from '../../../../../utils/globalUtils';
import Trees from '../../../../human-resource/tree/tree.entity';
export class CreateEmploymentContractDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsEnum(ContractState)
  state: ContractState;

  @IsOptional()
  @IsNumber()
  ourConfirmId: number;

  @IsOptional()
  @IsNumber()
  treeId: number;

  @IsOptional()
  @IsArray()
  treeIds?: number[] = [];

  trees?: Trees[];

  @IsOptional()
  @IsArray()
  viewUserIds?: number[] = []; // Гэрээг харах эрхтэй хэрэглэгчид

  @IsOptional()
  @IsNumber()
  voidContract: number;

  @IsOptional()
  @IsDateString()
  canceledDate: Date; //

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsBoolean()
  isContractAdd: boolean;

  @IsOptional()
  @IsNumber()
  mainContractId: number;

  @IsOptional()
  @IsString()
  mainContractName: string;

  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  numKey: string;

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
  @IsString()
  place: string;

  @IsOptional()
  @IsBoolean()
  isTime: boolean;

  @IsOptional()
  @IsDateString()
  contractCreateDate: Date; //

  @IsOptional()
  @IsDateString()
  addDate: Date; //

  @IsOptional()
  @IsDateString()
  endDate: Date; //

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
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  workerId: number;

  @IsOptional()
  @IsNumber()
  salary?: bigint;

  @IsOptional()
  @IsEnum(PerformanceType)
  salaryType: PerformanceType;

  @IsOptional()
  @IsBoolean()
  isAddition: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdditionDto)
  addition: AdditionDto[];

  @IsOptional()
  @IsBoolean()
  isShbo: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShboDto)
  shbo: ShboDto[];

  @IsOptional()
  @IsString()
  shortComment: string;

  @IsOptional()
  @IsNumber()
  file1: number;

  @IsOptional()
  @IsNumber()
  file2: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  fileIds: FileDto[];
}
