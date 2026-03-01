import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskState } from '../../../utils/enum-utils';

export default class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TaskState)
  state: TaskState;
}
