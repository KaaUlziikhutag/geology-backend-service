import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
  IsBoolean,
  IsDateString,
  ValidateNested,
  IsDate,
} from 'class-validator';
import {
  EmployeeType,
  GenderType,
  JobAction,
  MaritalStatus,
  Situation,
  TemporaryOptions,
  TypeOfPosition,
  WorkType,
} from '../../../utils/globalUtils';
import Users from '../../cloud/user/user.entity';
import Worker from '../member/worker/worker.entity';
import { ContactDto } from '../member/human/dto/contact.dto';
import { Type } from 'class-transformer';
export class HumanResourceDto {
  @IsOptional()
  @IsString()
  familyName: string; // Ургийн овог

  @IsOptional()
  @IsString()
  firstName: string; // Эцэг эхийн нэр

  @IsOptional()
  @IsString()
  faceBook: string; // Эцэг эхийн нэр

  @IsOptional()
  @IsNumber()
  occupationId: number; //

  @IsOptional()
  @IsNumber()
  insuranceId: number;

  @IsOptional()
  @IsNumber()
  holderId: number;

  @IsOptional()
  @IsString()
  lastName: string; // Өөрийн нэр

  @IsOptional()
  @IsString()
  nation: string; // Яс үндэс

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfEmployment?: Date; // Ажилд орсон огноо

  @IsOptional()
  @MaxLength(10)
  @IsString()
  regNumber: string; // Регистерийн дугаар

  @IsOptional()
  @IsString()
  taxpayerNumber?: string; //  татвар төлөгчийн дугаар

  @IsOptional()
  @IsString()
  driveNumber?: string; //  Жолооны үнэмлэхын дугаар

  @IsOptional()
  @IsNumber()
  disabled?: number; // 1: Хөгжлийн бэрхшээлгүй 2: Хөгжлийн бэрхшээлтэй

  @IsOptional()
  @IsNumber()
  mcountryId?: number; // Улс

  @IsOptional()
  @IsNumber()
  mCityId?: number; // Хот/ аймаг

  @IsOptional()
  @IsNumber()
  mDistrictId?: number; // Дүүрэг/ сум

  @IsOptional()
  @IsString()
  mCommitteeDetailAddress?: string; // Хороо/ баг

  @IsOptional()
  @IsNumber()
  birthCountryId?: number; // Төрсөн улс

  @IsOptional()
  @IsNumber()
  birthCityId?: number; // Төрсөн хот

  @IsOptional()
  @IsNumber()
  birthDistrictId?: number; // Төрсөн Сум дүүрэг

  @IsOptional()
  @IsNumber()
  birthCommetteeId?: number; // Баг хороо

  @IsOptional()
  @IsNumber()
  nCommetteeId?: number; // Дүүрэг/ сум

  @IsOptional()
  @IsNumber()
  mCommetteeId?: number; // Хороо/ баг

  @IsOptional()
  @IsString()
  birthDetailAddress?: string; // Хороо

  @IsOptional()
  @IsString()
  personalMail: string; // Хувийн И-мэйл

  @IsOptional()
  @IsString()
  mobile: string; // Утас

  @IsOptional()
  @IsString()
  mobileOther: string; // Утас -2

  @IsOptional()
  @IsString()
  homePhone: string; // Гэрийн утас

  @IsOptional()
  @IsDateString()
  birthDate?: Date; // Төрсөн он сар өдөр

  @IsOptional()
  @IsEnum(MaritalStatus)
  married: MaritalStatus; // Гэрэлтийн байдал

  @IsOptional()
  @IsEnum(GenderType)
  gender: GenderType; // Хүйс

  /// worker /////
  @IsOptional()
  @IsString()
  depName?: string;

  @IsOptional()
  @IsString()
  appName?: string;

  @IsOptional()
  @IsNumber()
  depId?: number;

  @IsOptional()
  @IsNumber()
  appId?: number;

  @IsOptional()
  @IsNumber()
  confirmId?: number;

  @IsOptional()
  @IsNumber()
  isActive?: number;

  @IsOptional()
  @IsString()
  workMail: string; // Ажилын майл

  @IsOptional()
  @IsString()
  workDuty: string; // Ажлын чиг үүрэг

  @IsOptional()
  @IsString()
  systemName: string; // Системд харагдах нэр

  @IsOptional()
  @IsString()
  code: string; // Цаг бүртгэлийн код

  @IsOptional()
  @IsEnum(WorkType)
  workerType: WorkType; // Ажилтны төрөл

  @IsOptional()
  @IsEnum(JobAction)
  jobAction?: JobAction; // Албан тушаалын төрөл

  @IsOptional()
  @IsEnum(TemporaryOptions)
  temporaryOptions?: TemporaryOptions;

  @IsOptional()
  @IsEnum(TypeOfPosition)
  typeOfPosition?: TypeOfPosition; // Албан тушаалын төрөл

  @IsOptional()
  @IsEnum(EmployeeType)
  employeeType?: EmployeeType; // Албан тушаалын төрөл

  @IsOptional()
  @IsEnum(Situation)
  situation?: Situation; // Нөхцөл

  @IsOptional()
  @IsNumber()
  humanId: number;

  @IsOptional()
  @IsBoolean()
  isRequest?: boolean; // Хүлээн авсан эсэх

  @IsOptional()
  @IsNumber()
  companyId: number; // Эмнэлгийн id

  @IsOptional()
  @IsNumber()
  profileId?: number; // нүүр зургийн id

  @IsOptional()
  @IsString()
  mRegion?: string;

  @IsOptional()
  @IsNumber()
  region?: number; // Иргэншил

  @IsOptional()
  @IsNumber()
  ncountryId?: number; // Улс

  @IsOptional()
  @IsNumber()
  nCityId?: number; // Хот/ аймаг

  @IsOptional()
  @IsNumber()
  nDistrictId?: number; // Дүүрэг/ сум

  @IsOptional()
  @IsString()
  nCommitteeDetailAddress?: string;

  @IsOptional()
  @IsString()
  nRegion?: string;

  @IsOptional()
  @IsString()
  workPhone?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}

export class UpdatedWorkerAndUser {
  worker: Worker;
  user: Users;
}
