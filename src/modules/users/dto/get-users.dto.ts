import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../../utils/enum-utils.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersDto {
  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}

export default GetUsersDto;
