import { Module } from '@nestjs/common';
import { RepeatScheduleService } from './schedule.service';
import { RepeatScheduleController } from './schedule.contoller';
import DirectSchedules from './schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([DirectSchedules]), ConfigModule],
  controllers: [RepeatScheduleController],
  providers: [RepeatScheduleService],
  exports: [RepeatScheduleService],
})
export class RepeatScheduleModule {}
