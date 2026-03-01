import { IsNumber, IsOptional } from 'class-validator';

export class UpdateWorkerAuthorDto {
  @IsNumber()
  @IsOptional()
  authorId: number;
}
