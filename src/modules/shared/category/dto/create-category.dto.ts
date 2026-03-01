import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  type: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  surName: string;

  @IsOptional()
  @IsString()
  mail: string;

  @IsOptional()
  @IsString()
  fax: string;

  @IsOptional()
  @IsBoolean()
  isIndividual?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  register: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsNumber()
  cityId: number;

  @IsOptional()
  @IsNumber()
  districtId: number;
}
