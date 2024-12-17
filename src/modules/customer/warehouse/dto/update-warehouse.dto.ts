import { PartialType } from '@nestjs/mapped-types';
import CreateWarehouseDto from './create-warehouse.dto.js';
import { IsNumber, IsOptional } from 'class-validator';

class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @IsOptional()
  @IsNumber()
  id: number;
}
export default UpdateWarehouseDto;
