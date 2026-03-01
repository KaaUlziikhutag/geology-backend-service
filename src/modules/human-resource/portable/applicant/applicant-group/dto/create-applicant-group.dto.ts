import { IsOptional, IsNumber } from 'class-validator';
export class CreateApplicantGroupDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  group_id: number;
}
