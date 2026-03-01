import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateHolidayDto } from './create-holiday.dto';
import Holiday from '../entities/holiday.entity';
import HolidayShift from '../entities/holiday-shift.entity';
import HolidayClose from '../entities/holiday-close.entity';

export class UpdateHolidayDto extends PartialType(CreateHolidayDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}

export class UpdatedHolidayWithShift {
  holidayShift?: HolidayShift;
  holiday?: Holiday;
  holidayClose?: HolidayClose;
}
