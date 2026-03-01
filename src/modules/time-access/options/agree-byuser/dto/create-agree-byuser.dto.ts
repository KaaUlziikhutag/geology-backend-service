import { IsArray, ArrayNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UserIdsDto {
  @IsArray() // Ensures the property is an array
  @ArrayNotEmpty() // Ensures the array is not empty
  @IsNumber({}, { each: true })
  userIds?: number[];

  @IsNumber()
  @IsOptional()
  autorId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
