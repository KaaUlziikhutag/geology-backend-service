import { IsOptional, IsNumber, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateExperienceDto {
  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  userId: number; // WorkerId

  @IsOptional()
  @IsString()
  workType: string; // Үйл ажиллагааны чиглэл

  @IsOptional()
  @IsString()
  company: string; // Байгууллагын нэр

  @IsOptional()
  @IsString()
  branch: string; // Салбар

  @IsOptional()
  @IsString()
  career: string; // Албан тушаал

  @IsOptional()
  @IsString()
  department: string; // Газар,алба, хэлтэс

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date; // Ажилаас гарсан огноо

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date; // Ажилд орсон огноо

  @IsOptional()
  @IsString()
  reason: string; // Ажилаас гарсан шалтгаан
}
